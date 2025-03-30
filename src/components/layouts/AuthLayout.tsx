
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Coffee, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // If already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Check if Supabase environment variables are set
  const isSupabaseConfigured = 
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-cream/20 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Coffee className="h-12 w-12 text-coffee-rich mb-2" />
          <h1 className="text-3xl font-bold text-coffee-rich">Brew Buddy</h1>
          <p className="text-coffee-mocha">Your favorite coffee companion</p>
        </div>

        {!isSupabaseConfigured && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Supabase Connection Required</AlertTitle>
            <AlertDescription>
              Please connect to Supabase and set the environment variables in your Lovable project to enable authentication.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
