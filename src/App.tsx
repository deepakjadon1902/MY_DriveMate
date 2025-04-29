import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AnimatePresence } from 'framer-motion';

// Layout
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Protected pages
import Dashboard from './pages/dashboard/Dashboard';
import OfferRide from './pages/dashboard/OfferRide';
import SearchRides from './pages/dashboard/SearchRides';
import MyRides from './pages/dashboard/MyRides';
import Profile from './pages/dashboard/Profile';
import Notifications from './pages/dashboard/Notifications';

// Utilities
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/ui/Loader';

function App() {
  const { isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/offer-ride" element={<OfferRide />} />
          <Route path="/search-rides" element={<SearchRides />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;