import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                className="bg-primary rounded-full p-2 text-primary-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Car size={20} />
              </motion.div>
              <span className="font-bold text-lg tracking-tight">
                My Drivemate
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Simplifying ride sharing for everyone, everywhere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
      
          
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                GLA UNiversity
              </li>
              <li className="text-muted-foreground">
                Mathura, India 281001
              </li>
              <li>
                <a href="mailto:info@mydrivemate.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  deepakjadon1907@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-foreground transition-colors">
                  +91 9149370081
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {currentYear} My Drivemate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;