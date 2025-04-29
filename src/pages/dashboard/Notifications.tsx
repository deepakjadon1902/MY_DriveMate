import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Notification } from '../../types/supabase';
import { BellRing, CheckCircle, XCircle, AlertTriangle, Car, MessageCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const Notifications: React.FC = () => {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  
  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profile) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', profile.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [profile]);
  
  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    if (!profile) return;
    
    setMarkingAsRead(notificationId);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    } finally {
      setMarkingAsRead(null);
    }
  };
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!profile) return;
    
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) {
      toast.info('No unread notifications');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('recipient_id', profile.id)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Car className="text-primary" />;
      case 'confirmation':
        return <CheckCircle className="text-green-600 dark:text-green-400" />;
      case 'cancellation':
        return <XCircle className="text-red-600 dark:text-red-400" />;
      default:
        return <MessageCircle className="text-primary" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated on your ride bookings and confirmations
            </p>
          </div>
          
          <button
            onClick={markAllAsRead}
            className="btn-secondary flex items-center gap-2"
            disabled={isLoading || notifications.every(n => n.read)}
          >
            <CheckCircle size={16} />
            Mark All as Read
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`glass-card p-6 shadow-glass ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    !notification.read ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        {notification.type === 'booking' && 'New Booking Request'}
                        {notification.type === 'confirmation' && 'Ride Confirmed'}
                        {notification.type === 'cancellation' && 'Ride Cancelled'}
                      </h3>
                      
                      <div className="text-xs text-muted-foreground">
                        {format(parseISO(notification.created_at), 'MMM d, yyyy • h:mm a')}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {notification.content}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <Link
                        to="/my-rides"
                        className="text-sm text-primary hover:underline flex items-center"
                      >
                        <Car size={14} className="mr-1" />
                        View Ride Details
                      </Link>
                      
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm flex items-center text-muted-foreground hover:text-foreground"
                          disabled={markingAsRead === notification.id}
                        >
                          {markingAsRead === notification.id ? (
                            <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <CheckCircle size={14} className="mr-1" />
                          )}
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 glass-card">
            <BellRing size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-medium mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You don't have any notifications yet
            </p>
          </div>
        )}
        
        {/* Notification Guide */}
        <div className="mt-12 p-6 bg-secondary rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Notification Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary">
                <Car size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Booking Requests</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.role === 'driver' 
                    ? "When passengers book your offered rides" 
                    : "Confirmation that you've requested a ride"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Ride Confirmations</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.role === 'driver' 
                    ? "When you confirm a passenger's booking" 
                    : "When a driver accepts your booking request"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600 dark:text-red-400">
                <XCircle size={20} />
              </div>
              <div>
                <h4 className="font-medium mb-1">Cancellations</h4>
                <p className="text-sm text-muted-foreground">
                  When a ride is cancelled by you or the other party
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;