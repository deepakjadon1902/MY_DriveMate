import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Ride, Booking, Profile } from '../../types/supabase';
import { MapPin, Clock, Calendar, Users, CreditCard, Car, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

// Extend the Booking type to include ride and associated profile
type ExtendedBooking = Booking & {
  ride: Ride;
  profile: Profile; // Driver for passenger's bookings, Passenger for driver's bookings
};

const MyRides: React.FC = () => {
  const { profile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'going' | 'finished' | 'cancelled'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState<{
    upcoming: ExtendedBooking[];
    going: ExtendedBooking[];
    finished: ExtendedBooking[];
    cancelled: ExtendedBooking[];
  }>({
    upcoming: [],
    going: [],
    finished: [],
    cancelled: [],
  });
  
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      
      try {
        let bookingsQuery;
        
        if (profile.role === 'passenger') {
          // Fetch bookings for passenger, including ride details and driver profiles
          bookingsQuery = supabase
            .from('bookings')
            .select(`
              *,
              ride:rides(*),
              profile:rides(driver:profiles(*))
            `)
            .eq('passenger_id', profile.id);
        } else {
          // Fetch bookings for driver's rides, including passenger profiles
          bookingsQuery = supabase
            .from('bookings')
            .select(`
              *,
              ride:rides!inner(*),
              profile:profiles(*)
            `)
            .eq('ride.driver_id', profile.id);
        }
        
        const { data, error } = await bookingsQuery;
        
        if (error) throw error;
        
        // Process and categorize bookings
        const processedBookings = {
          upcoming: [],
          going: [],
          finished: [],
          cancelled: [],
        };
        
        data.forEach((booking: any) => {
          // Restructure driver/passenger profile data
          if (profile.role === 'passenger') {
            booking.profile = booking.profile.driver;
          }
          
          processedBookings[booking.status as keyof typeof processedBookings].push(booking);
        });
        
        setBookings(processedBookings as any);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load your rides');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookings();
  }, [profile]);
  
  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: 'upcoming' | 'going' | 'finished' | 'cancelled') => {
    if (!profile) return;
    
    setUpdatingStatus(bookingId);
    
    try {
      // Get booking details for notification
      const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
          *,
          ride:rides(*),
          passenger:profiles(*)
        `)
        .eq('id', bookingId)
        .single();
      
      if (!bookingData) throw new Error('Booking not found');
      
      // Update booking status
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);
      
      if (updateError) throw updateError;
      
      // Create notification based on status change
      let notificationType = 'confirmation';
      let notificationContent = '';
      
      if (newStatus === 'going') {
        notificationType = 'confirmation';
        notificationContent = `Your ride from ${bookingData.ride.pickup_location} to ${bookingData.ride.destination} has been confirmed by the driver. Contact: ${profile.phone_number}, Email: ${profile.email}`;
      } else if (newStatus === 'cancelled') {
        notificationType = 'cancellation';
        notificationContent = `${profile.role === 'driver' ? 'Driver' : 'Passenger'} has cancelled the ride from ${bookingData.ride.pickup_location} to ${bookingData.ride.destination}.`;
        
        // If driver cancels, increase available seats
        if (profile.role === 'driver') {
          const { error: updateSeatsError } = await supabase
            .from('rides')
            .update({ available_seats: bookingData.ride.available_seats + 1 })
            .eq('id', bookingData.ride.id);
          
          if (updateSeatsError) throw updateSeatsError;
        }
      } else if (newStatus === 'finished') {
        notificationType = 'confirmation';
        notificationContent = `Your ride from ${bookingData.ride.pickup_location} to ${bookingData.ride.destination} has been marked as completed.`;
      }
      
      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          sender_id: profile.id,
          recipient_id: profile.role === 'driver' ? bookingData.passenger.id : bookingData.ride.driver_id,
          type: notificationType as 'booking' | 'confirmation' | 'cancellation',
          content: notificationContent,
          ride_id: bookingData.ride.id,
          read: false,
        });
      
      if (notificationError) throw notificationError;
      
      // Update state
      setBookings(prev => {
        const currentTab = prev[activeTab as keyof typeof prev];
        const updatedTabBookings = currentTab.filter(booking => booking.id !== bookingId);
        
        return {
          ...prev,
          [activeTab]: updatedTabBookings,
          [newStatus]: [...prev[newStatus as keyof typeof prev], {
            ...currentTab.find(booking => booking.id === bookingId)!,
            status: newStatus,
          }],
        };
      });
      
      toast.success(`Ride status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update ride status');
    } finally {
      setUpdatingStatus(null);
    }
  };
  
  const renderBookingCard = (booking: ExtendedBooking) => {
    const { ride, profile: otherParty } = booking;
    
    return (
      <motion.div
        key={booking.id}
        className="glass-card p-6 shadow-glass"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
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
          
          <div className="flex flex-col items-end space-y-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'upcoming' ? 'status-upcoming' :
              booking.status === 'going' ? 'status-going' :
              booking.status === 'finished' ? 'status-finished' : 'status-cancelled'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </div>
            
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              ₹{ride.price_per_seat}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border my-4"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Ride Details</h4>
            <div className="flex items-center text-sm">
              <Car size={16} className="mr-2" />
              <span className="font-medium">{ride.car_model}</span>
              <span className="ml-2 text-muted-foreground">({ride.number_plate})</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Users size={16} className="mr-2" />
              <span>1 seat booked</span>
            </div>
            
            <div className="flex items-center text-sm">
              <CreditCard size={16} className="mr-2" />
              <span>₹{ride.price_per_seat} per seat</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              {profile?.role === 'driver' ? 'Passenger' : 'Driver'} Details
            </h4>
            <div className="text-sm font-medium">{otherParty.full_name}</div>
            
            {(booking.status === 'going' || booking.status === 'finished') && (
              <>
                <div className="text-sm">{otherParty.phone_number}</div>
                <div className="text-sm">{otherParty.email}</div>
              </>
            )}
            
            {booking.status === 'upcoming' && profile?.role === 'driver' && (
              <div className="flex space-x-2 mt-4">
                <button
                  className="btn-primary text-xs py-1"
                  onClick={() => updateBookingStatus(booking.id, 'going')}
                  disabled={updatingStatus === booking.id}
                >
                  {updatingStatus === booking.id ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Confirm Ride"
                  )}
                </button>
                <button
                  className="btn-ghost text-xs py-1"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  disabled={updatingStatus === booking.id}
                >
                  Cancel
                </button>
              </div>
            )}
            
            {booking.status === 'going' && (
              <div className="flex space-x-2 mt-4">
                <button
                  className="btn-primary text-xs py-1"
                  onClick={() => updateBookingStatus(booking.id, 'finished')}
                  disabled={updatingStatus === booking.id}
                >
                  {updatingStatus === booking.id ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Mark as Completed"
                  )}
                </button>
                <button
                  className="btn-ghost text-xs py-1"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  disabled={updatingStatus === booking.id}
                >
                  Cancel
                </button>
              </div>
            )}
            
            {booking.status === 'upcoming' && profile?.role === 'passenger' && (
              <div className="flex space-x-2 mt-4">
                <button
                  className="btn-ghost text-xs py-1"
                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                  disabled={updatingStatus === booking.id}
                >
                  {updatingStatus === booking.id ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Cancel Booking"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };
  
  const renderEmptyState = () => (
    <div className="text-center py-12 glass-card">
      <MapPin size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 className="text-xl font-medium mb-2">No {activeTab} rides</h3>
      <p className="text-muted-foreground">
        {activeTab === 'upcoming' && "You don't have any upcoming rides"}
        {activeTab === 'going' && "You don't have any ongoing rides"}
        {activeTab === 'finished' && "You haven't completed any rides yet"}
        {activeTab === 'cancelled' && "You don't have any cancelled rides"}
      </p>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Rides</h1>
          <p className="text-muted-foreground">
            Manage your bookings and track ride status
          </p>
        </div>
        
        {/* Status Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'upcoming'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Upcoming 🔵
            </button>
            <button
              onClick={() => setActiveTab('going')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'going'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Going 🟡
            </button>
            <button
              onClick={() => setActiveTab('finished')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'finished'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Finished 🟢
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'cancelled'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              } transition-colors`}
            >
              Cancelled 🔴
            </button>
          </nav>
        </div>
        
        {/* Bookings Display */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {bookings[activeTab].length > 0 ? (
              bookings[activeTab].map(renderBookingCard)
            ) : (
              renderEmptyState()
            )}
          </motion.div>
        )}
        
        {/* Ride Management Tips */}
        <div className="mt-12 p-6 bg-secondary rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Ride Status Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-800 dark:text-blue-300">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Upcoming</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.role === 'driver' 
                    ? "Rides that passengers have booked but you haven't confirmed yet" 
                    : "Rides you've booked but the driver hasn't confirmed yet"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-800 dark:text-yellow-300">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Going</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.role === 'driver' 
                    ? "Rides you've confirmed and are scheduled to happen" 
                    : "Rides the driver has confirmed and are scheduled to happen"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-800 dark:text-green-300">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Finished</h4>
                <p className="text-sm text-muted-foreground">
                  Rides that have been completed successfully
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-800 dark:text-red-300">
                <XCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Cancelled</h4>
                <p className="text-sm text-muted-foreground">
                  Rides that were cancelled by you or the {profile?.role === 'driver' ? 'passenger' : 'driver'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyRides;