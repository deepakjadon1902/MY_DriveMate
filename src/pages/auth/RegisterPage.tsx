import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Car, User, Mail, Lock, Phone, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'driver' | 'passenger'>('passenger');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simple validation
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, fullName, phoneNumber, role);
      toast.success('Registration successful! Please login to continue.');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="glass-card p-8 shadow-glass overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="inline-block bg-primary rounded-full p-3 text-primary-foreground mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Car size={28} />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create an Account
          </motion.h1>
          
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join My Drivemate and start sharing rides
          </motion.p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-muted-foreground" />
              </div>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input pl-10"
                placeholder="John Doe"
                required
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-muted-foreground" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-muted-foreground" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-muted-foreground" />
              </div>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input pl-10"
                placeholder="9876543210"
                required
                pattern="[0-9]{10}"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-sm font-medium mb-3">
              I want to register as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  role === 'passenger'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary border-border hover:bg-primary/5'
                } transition-colors flex flex-col items-center gap-2`}
                onClick={() => setRole('passenger')}
              >
                <User size={24} />
                <span>Passenger</span>
              </button>
              
              <button
                type="button"
                className={`p-4 rounded-lg border ${
                  role === 'driver'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary border-border hover:bg-primary/5'
                } transition-colors flex flex-col items-center gap-2`}
                onClick={() => setRole('driver')}
              >
                <Car size={24} />
                <span>Driver</span>
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck size={18} />
                  Sign Up
                </>
              )}
            </button>
          </motion.div>
        </form>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
        
        {/* Animated elements */}
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5] 
          }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        
        <motion.div 
          className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.2, 0.4] 
          }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
      </motion.div>
    </div>
  );
};

export default RegisterPage;