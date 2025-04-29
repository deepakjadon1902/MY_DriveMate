import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Car, Sun, Moon, Menu, X, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { user, signOut, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const navItems = [
    { title: 'Dashboard', path: '/dashboard', authRequired: true },
    { title: profile?.role === 'driver' ? 'Offer Ride' : 'Search Rides', 
      path: profile?.role === 'driver' ? '/offer-ride' : '/search-rides', 
      authRequired: true },
    { title: 'My Rides', path: '/my-rides', authRequired: true },
    { title: 'Profile', path: '/profile', authRequired: true },
  ];
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="bg-primary rounded-full p-2 text-primary-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Car size={20} />
            </motion.div>
            <span className="font-bold text-lg md:text-xl tracking-tight">
              My Drivemate
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              (!item.authRequired || user) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.title}
                </Link>
              )
            ))}
            
            {user && (
              <Link
                to="/notifications"
                className="p-2 ml-1 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </Link>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 ml-1 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="ml-2 btn-primary"
              >
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="ml-2 btn-primary">
                Sign In
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            {user && (
              <Link
                to="/notifications"
                className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </Link>
            )}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-secondary transition-colors duration-200"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          className="md:hidden glass shadow-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              (!item.authRequired || user) && (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-foreground hover:bg-secondary'
                  }`}
                >
                  {item.title}
                </Link>
              )
            ))}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-secondary"
              >
                Sign In
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;