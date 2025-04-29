import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Ride } from '../../types/supabase';
import { Search, MapPin, Calendar, Clock, Users, CreditCard, Car, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const SearchRides: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  
  // Validate if user is a passenger
  if (profile?.role !== 'passenger') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle size={64} className="mx-auto text-accent mb-4" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need to be registered as a passenger to search for rides.
        </p>
      </div>
    );
  }
  
  // Fetch all available rides
  useEffect(() => {
    const fetchRides = async () => {
      setIsSearching(true);
      try {
        const { data: ridesData, error: ridesError } = await supabase
          .from('rides')
          .select('*')
          .gte('date_time', new Date().toISOString())
          .gt('available_seats', 0)
          .order('date_time', { ascending: true });
        
        if (ridesError) throw ridesError;
        
        // Filter out rides with no available seats
        const availableRides = ridesData.filter(ride => ride.available_seats > 0);
        setRides(availableRides);
        setFilteredRides(availableRides);
      } catch (error) {
        console.error('Error fetching rides:', error);
        toast.error('Failed to load rides. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchRides();
  }, []);
  
  // Apply filters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    let filtered = [...rides];
    
    // Filter by destination
    if (destination) {
      filtered = filtered.filter(ride =>
        ride.destination.toLowerCase().includes(destination.toLowerCase())
      );
    }
    
    // Filter by date
    if (date) {
      const selectedDate = new Date(date);
      filtered = filtered.filter(ride => {
        const rideDate = new Date(ride.date_time);
        return (
          rideDate.getFullYear() === selectedDate.getFullYear() &&
          rideDate.getMonth() === selectedDate.getMonth() &&
          rideDate.getDate() === selectedDate.getDate()
        );
      });
    }
    
    setFilteredRides(filtered);
  };
  
  // Book a ride
  const handleBookRide = async (rideId: string) => {
    if (!profile) return;
    
    setIsBooking(rideId);
    
    try {
      // Check if ride is already booked by this passenger
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('ride_id', rideId)
        .eq('passenger_id', profile.id)
        .not('status', 'eq', 'cancelled');
      
      if (existingBookings && existingBookings.length > 0) {
        toast.error('You have already booked this ride');
        return;
      }
      
      // Get ride details
      const { data: ride } = await supabase
        .from('rides')
        .select('*')
        .eq('id', rideId)
        .single();
      
      if (!ride) {
        toast.error('Ride not found');
        return;
      }
      
      if (ride.available_seats <= 0) {
        toast.error('No seats available');
        return;
      }
      
      // Start a transaction
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          ride_id: rideId,
          passenger_id: profile.id,
          status: 'upcoming'
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;
      
      // Update available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ available_seats: ride.available_seats - 1 })
        .eq('id', rideId);
      
      if (updateError) throw updateError;
      
      // Create notification for driver
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          sender_id: profile.id,
          recipient_id: ride.driver_id,
          type: 'booking',
          content: `${profile.full_name} has booked your ride from ${ride.pickup_location} to ${ride.destination}. Contact: ${profile.phone_number}, Email: ${profile.email}`,
          ride_id: rideId,
          read: false
        });
      
      if (notificationError) throw notificationError;
      
      // Update local state
      setRides(prevRides =>
        prevRides.map(r =>
          r.id === rideId
            ? { ...r, available_seats: r.available_seats - 1 }
            : r
        )
      );
      
      setFilteredRides(prevRides =>
        prevRides.map(r =>
          r.id === rideId
            ? { ...r, available_seats: r.available_seats - 1 }
            : r
        )
      );
      
      toast.success('Ride booked successfully!');
      navigate('/my-rides');
    } catch (error) {
      console.error('Error booking ride:', error);
      toast.error('Failed to book ride. Please try again.');
    } finally {
      setIsBooking(null);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setDestination('');
    setDate('');
    setFilteredRides(rides);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
          <p className="text-muted-foreground">
            Search for available rides and book your seat
          </p>
        </div>
        
        {/* Search Filters */}
        <div className="glass-card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-2">
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input"
                  placeholder="Where are you going?"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="flex items-end space-x-2">
                <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                  <Search size={18} />
                  Search
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Rides List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Rides</h2>
          
          {isSearching ? (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          ) : filteredRides.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredRides.map((ride) => (
                <motion.div
                  key={ride.id}
                  className="glass-card p-6 shadow-glass"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center text-lg font-semibold">
                        <MapPin size={18} className="text-primary mr-2" />
                        <span>{ride.pickup_location} → {ride.destination}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Calendar size={16} className="mr-1" />
                        <span>{format(parseISO(ride.date_time), 'EEEE, MMM d, yyyy')}</span>
                      </div>
                      
                      <div className="flex items-center text-muted-foreground">
                        <Clock size={16} className="mr-1" />
                        <span>{format(parseISO(ride.date_time), 'h:mm a')}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        ₹{ride.price_per_seat}
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Car size={16} className="mr-2" />
                        <span className="font-medium">{ride.car_model}</span>
                        <span className="ml-2 text-muted-foreground">({ride.number_plate})</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Users size={16} className="mr-2" />
                        <span>{ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''} available</span>
                      </div>
                    </div>
                    
                    <button
                      className="btn-primary"
                      onClick={() => handleBookRide(ride.id)}
                      disabled={isBooking === ride.id || ride.available_seats <= 0}
                    >
                      {isBooking === ride.id ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      ) : ride.available_seats <= 0 ? (
                        "Fully Booked"
                      ) : (
                        "Book Ride"
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass-card">
              <MapPin size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-medium mb-2">No rides found</h3>
              <p className="text-muted-foreground mb-6">
                {destination || date 
                  ? "Try adjusting your search filters" 
                  : "There are no available rides at the moment"}
              </p>
              {(destination || date) && (
                <button className="btn-secondary" onClick={resetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Ride Tips */}
        <div className="p-6 bg-secondary rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Ride Booking Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Save on travel costs</h4>
                <p className="text-sm text-muted-foreground">
                  Ride sharing can be up to 60% cheaper than taking a taxi.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Book in advance</h4>
                <p className="text-sm text-muted-foreground">
                  Popular routes get booked quickly, especially during weekends.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Safety first</h4>
                <p className="text-sm text-muted-foreground">
                  Check driver ratings and car details before booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchRides;