import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const AuthLayout: React.FC = () => {
  const { session } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Redirect if already logged in
  if (session) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <button
          className="p-2 rounded-full glass-card text-foreground"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <motion.div 
        className="flex-grow flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;