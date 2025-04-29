import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Ride, Booking, Notification } from '../../types/supabase';
import { Car, Search, MapPin, Clock, Users, CreditCard, BellRing } from 'lucide-react';
import { format } from 'date-fns';
import Loader from '../../components/ui/Loader';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<(Booking & { ride: Ride })[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      if (!profile) return;
      
      try {
        // Fetch data based on user role
        if (profile.role === 'driver') {
          // Recent rides offered by the driver
          const { data: rides } = await supabase
            .from('rides')
            .select('*')
            .eq('driver_id', profile.id)
            .order('date_time', { ascending: false })
            .limit(3);
          
          setRecentRides(rides || []);
        } else {
          // Recent available rides for passengers
          const { data: rides } = await supabase
            .from('rides')
            .select('*')
            .gte('date_time', new Date().toISOString())
            .order('date_time', { ascending: true })
            .limit(3);
          
          setRecentRides(rides || []);
        }
        
        // Upcoming bookings for both drivers and passengers
        const bookingsQuery = profile.role === 'driver'
          ? supabase
              .from('bookings')
              .select('*, ride:rides(*)')
              .eq('status', 'upcoming')
              .in('ride.driver_id', [profile.id])
              .order('created_at', { ascending: false })
              .limit(3)
          : supabase
              .from('bookings')
              .select('*, ride:rides(*)')
              .eq('passenger_id', profile.id)
              .eq('status', 'upcoming')
              .order('created_at', { ascending: false })
              .limit(3);
        
        const { data: bookings } = await bookingsQuery;
        setUpcomingBookings(bookings as (Booking & { ride: Ride })[] || []);
        
        // Unread notifications
        const { data: notifications } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', profile.id)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(5);
        
        setUnreadNotifications(notifications || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [profile]);
  
  if (isLoading) {
    return <div className="p-8"><Loader /></div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            {profile?.role === 'driver' 
              ? 'Manage your rides and see who\'s booked them' 
              : 'Find and book your next ride'}
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="glass-card p-6 mb-8">
          <h2 className="font-semibold text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to={profile?.role === 'driver' ? '/offer-ride' : '/search-rides'}>
              <motion.div 
                className="p-4 rounded-lg bg-primary/10 text-primary flex items-center space-x-3 hover:bg-primary/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {profile?.role === 'driver' ? <Car size={24} /> : <Search size={24} />}
                <span className="font-medium">{profile?.role === 'driver' ? 'Offer a Ride' : 'Find a Ride'}</span>
              </motion.div>
            </Link>
            
            <Link to="/my-rides">
              <motion.div 
                className="p-4 rounded-lg bg-secondary flex items-center space-x-3 hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock size={24} />
                <span className="font-medium">My Rides</span>
              </motion.div>
            </Link>
            
            <Link to="/notifications">
              <motion.div 
                className="p-4 rounded-lg bg-secondary flex items-center space-x-3 hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={unreadNotifications.length > 0 ? "relative" : ""}
              >
                <BellRing size={24} />
                <span className="font-medium">Notifications</span>
                {unreadNotifications.length > 0 && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
                    {unreadNotifications.length}
                  </div>
                )}
              </motion.div>
            </Link>
            
            <Link to="/profile">
              <motion.div 
                className="p-4 rounded-lg bg-secondary flex items-center space-x-3 hover:bg-secondary/80 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User size={24} />
                <span className="font-medium">Profile</span>
              </motion.div>
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent/Available Rides */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">
                {profile?.role === 'driver' ? 'Recent Rides Offered' : 'Available Rides'}
              </h2>
              <Link 
                to={profile?.role === 'driver' ? '/my-rides' : '/search-rides'}
                className="text-primary text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            
            {recentRides.length > 0 ? (
              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <motion.div 
                    key={ride.id}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-primary" />
                        <span className="font-medium">{ride.pickup_location} → {ride.destination}</span>
                      </div>
                      <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                        ₹{ride.price_per_seat}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {format(new Date(ride.date_time), 'MMM d, yyyy • h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {ride.available_seats} seats
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {ride.car_model} • {ride.number_plate}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Car size={40} className="mx-auto mb-2 opacity-50" />
                <p>{profile?.role === 'driver' ? "You haven't offered any rides yet" : "No available rides found"}</p>
                <Link 
                  to={profile?.role === 'driver' ? '/offer-ride' : '/search-rides'}
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  {profile?.role === 'driver' ? 'Offer a ride' : 'Search for rides'}
                </Link>
              </div>
            )}
          </div>
          
          {/* Upcoming Bookings */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-xl">Upcoming Bookings</h2>
              <Link 
                to="/my-rides"
                className="text-primary text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <motion.div 
                    key={booking.id}
                    className="p-4 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-primary" />
                        <span className="font-medium">{booking.ride.pickup_location} → {booking.ride.destination}</span>
                      </div>
                      <div className="status-upcoming text-xs px-2 py-1 rounded-full">
                        Upcoming
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {format(new Date(booking.ride.date_time), 'MMM d, yyyy • h:mm a')}
                      </div>
                      <div className="flex items-center">
                        <CreditCard size={14} className="mr-1" />
                        ₹{booking.ride.price_per_seat}
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {booking.ride.car_model} • {booking.ride.number_plate}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                <p>No upcoming bookings</p>
                <Link 
                  to={profile?.role === 'driver' ? '/offer-ride' : '/search-rides'}
                  className="mt-2 inline-block text-primary hover:underline"
                >
                  {profile?.role === 'driver' ? 'Offer a ride' : 'Book a ride'}
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Notifications */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Recent Notifications</h2>
            <Link 
              to="/notifications"
              className="text-primary text-sm hover:underline"
            >
              View all
            </Link>
          </div>
          
          {unreadNotifications.length > 0 ? (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <motion.div 
                  key={notification.id}
                  className="p-4 rounded-lg bg-primary/5 border border-primary/20 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BellRing size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">
                        {notification.type === 'booking' && 'New Booking Request'}
                        {notification.type === 'confirmation' && 'Ride Confirmed'}
                        {notification.type === 'cancellation' && 'Ride Cancelled'}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notification.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BellRing size={40} className="mx-auto mb-2 opacity-50" />
              <p>No new notifications</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Adding missing imports
import { User, Calendar } from 'lucide-react';

export default Dashboard;