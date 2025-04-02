
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const AdminProtectedRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  // Log the authentication state for debugging
  useEffect(() => {
    console.log("Admin route authentication state:", { 
      isAuthenticated, 
      isAdmin, 
      isLoading,
      userRole: user?.role 
    });
  }, [isAuthenticated, isAdmin, isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-coffee-rich" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access the admin area.",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to home with a message
  if (!isAdmin) {
    toast({
      title: "Access Denied",
      description: "You don't have administrator privileges.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // If admin, render the admin routes
  return <Outlet />;
};

export default AdminProtectedRoute;
