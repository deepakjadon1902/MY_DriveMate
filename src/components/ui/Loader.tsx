import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, size = 'medium' }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.5 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 0.6,
      },
    },
  };
  
  const loader = (
    <motion.div
      className="flex items-center justify-center space-x-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        className={`${sizeClass[size]} rounded-full bg-primary`} 
        variants={item}
      />
      <motion.div 
        className={`${sizeClass[size]} rounded-full bg-primary`} 
        variants={item}
      />
      <motion.div 
        className={`${sizeClass[size]} rounded-full bg-primary`} 
        variants={item}
      />
    </motion.div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {loader}
      </div>
    );
  }
  
  return loader;
};

export default Loader;