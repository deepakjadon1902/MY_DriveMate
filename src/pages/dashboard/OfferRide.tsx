import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Car, MapPin, Calendar, Clock, Users, CreditCard, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const OfferRide: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableSeats, setAvailableSeats] = useState(1);
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [carModel, setCarModel] = useState('');
  const [numberPlate, setNumberPlate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Validate if user is a driver
  if (profile?.role !== 'driver') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle size={64} className="mx-auto text-accent mb-4" />
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need to be registered as a driver to offer rides.
        </p>
      </div>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupLocation || !destination || !date || !time || !carModel || !numberPlate) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Validate number plate format (basic validation)
    const numberPlateRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!numberPlateRegex.test(numberPlate)) {
      toast.error('Invalid number plate format. Example: DL01AB1234');
      return;
    }
    
    // Validate date is in the future
    const rideDateTime = new Date(`${date}T${time}`);
    if (rideDateTime <= new Date()) {
      toast.error('Ride date and time must be in the future');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('rides')
        .insert({
          driver_id: profile.id,
          pickup_location: pickupLocation,
          destination,
          date_time: rideDateTime.toISOString(),
          available_seats: availableSeats,
          price_per_seat: pricePerSeat,
          car_model: carModel,
          number_plate: numberPlate.toUpperCase(),
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Ride offered successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error offering ride:', error);
      toast.error('Failed to offer ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Offer a Ride</h1>
          <p className="text-muted-foreground">
            Share your journey with others and reduce travel costs
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="glass-card p-8 shadow-glass">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Information */}
              <div className="col-span-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2 text-primary" />
                  Route Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium mb-2">
                      Pickup Location
                    </label>
                    <input
                      id="pickupLocation"
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="input"
                      placeholder="Enter pickup location"
                      required
                    />
                  </div>
                  
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
                      placeholder="Enter destination"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Date and Time */}
              <div className="col-span-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 text-primary" />
                  Date and Time
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-2">
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Ride Details */}
              <div className="col-span-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="mr-2 text-primary" />
                  Ride Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="availableSeats" className="block text-sm font-medium mb-2">
                      Available Seats
                    </label>
                    <select
                      id="availableSeats"
                      value={availableSeats}
                      onChange={(e) => setAvailableSeats(Number(e.target.value))}
                      className="input"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="pricePerSeat" className="block text-sm font-medium mb-2">
                      Price per Seat (₹)
                    </label>
                    <input
                      id="pricePerSeat"
                      type="number"
                      value={pricePerSeat}
                      onChange={(e) => setPricePerSeat(Number(e.target.value))}
                      className="input"
                      placeholder="Enter price in ₹"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Car Details */}
              <div className="col-span-full">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Car className="mr-2 text-primary" />
                  Car Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="carModel" className="block text-sm font-medium mb-2">
                      Car Model
                    </label>
                    <input
                      id="carModel"
                      type="text"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="input"
                      placeholder="e.g. Honda City, Maruti Swift"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="numberPlate" className="block text-sm font-medium mb-2">
                      Number Plate
                    </label>
                    <input
                      id="numberPlate"
                      type="text"
                      value={numberPlate}
                      onChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
                      className="input"
                      placeholder="e.g. DL01AB1234"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Format: State code (2 letters) + Number (2 digits) + Letters (1-2) + Number (4 digits)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Car size={18} />
                    Offer Ride
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <h3 className="flex items-center text-accent font-medium mb-2">
              <AlertCircle size={18} className="mr-2" />
              Important Information
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Ensure all details provided are accurate and up-to-date</li>
              <li>• You'll receive notifications when passengers book your ride</li>
              <li>• You can cancel rides anytime, but please be considerate</li>
              <li>• Contact information will be shared with passengers after booking confirmation</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OfferRide;