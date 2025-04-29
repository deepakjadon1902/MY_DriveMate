import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, CarFront, UserCircle } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const Profile: React.FC = () => {
  const { profile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Profile not found</h2>
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    );
  }
  
  // Not implementing edit functionality since we don't have update profile API
  // in the requirements, but showing UI for it
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information
          </p>
        </div>
        
        <div className="glass-card relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
          <motion.div 
            className="absolute top-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-2xl -z-10"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3] 
            }}
            transition={{ repeat: Infinity, duration: 8 }}
          />
          
          <div className="relative p-8">
            <div className="text-center mb-8">
              <motion.div 
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <User className="w-12 h-12 text-primary" />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {profile.full_name}
              </motion.h2>
              
              <motion.div
                className="inline-flex items-center mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {profile.role === 'driver' ? (
                  <>
                    <CarFront size={14} className="mr-1" />
                    Driver
                  </>
                ) : (
                  <>
                    <UserCircle size={14} className="mr-1" />
                    Passenger
                  </>
                )}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div 
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <User size={18} className="text-primary mr-3" />
                  <span>{profile.full_name}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Mail size={18} className="text-primary mr-3" />
                  <span>{profile.email}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  <Phone size={18} className="text-primary mr-3" />
                  <span>{profile.phone_number}</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                <div className="flex items-center p-3 bg-secondary rounded-lg">
                  {profile.role === 'driver' ? (
                    <CarFront size={18} className="text-primary mr-3" />
                  ) : (
                    <UserCircle size={18} className="text-primary mr-3" />
                  )}
                  <span className="capitalize">{profile.role}</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              className="border-t border-border pt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-xl font-semibold mb-2">
                Welcome to My Drivemate, {profile.full_name.split(' ')[0]}!
              </p>
              <p className="text-muted-foreground mb-4">
                {profile.role === 'driver'
                  ? "Thank you for joining as a driver. You're helping make travel more accessible for everyone."
                  : "Thank you for joining as a passenger. Enjoy affordable and convenient rides to your destination."
                }
              </p>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg max-w-lg mx-auto">
                <h3 className="font-medium mb-2 text-primary">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.role === 'driver'
                    ? "Share your journey with others by offering rides from your dashboard. You'll receive notifications when passengers book your rides."
                    : "Find available rides from your dashboard. After booking, you'll receive a confirmation notification when the driver approves your request."
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;