
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header isAdmin={isAdmin} />
      
      {/* Main content */}
      <main className="flex-1 container pb-20 md:pb-6 pt-4">
        <Outlet />
      </main>
      
      {/* Bottom navigation for mobile */}
      <MobileBottomNav />
    </div>
  );
};

export default AppLayout;
