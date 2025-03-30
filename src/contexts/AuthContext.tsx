
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  points: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active Supabase session on load
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from the profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }
          
          // Set user state with profile data - ensure role is either 'customer' or 'admin'
          setUser({
            id: session.user.id,
            name: profile.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (profile.role === 'admin' ? 'admin' : 'customer') as 'customer' | 'admin',
            points: profile.points || 0
          });
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Check session when component mounts
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile upon sign in
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            setUser({
              id: session.user.id,
              name: profile.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (profile.role === 'admin' ? 'admin' : 'customer') as 'customer' | 'admin',
              points: profile.points || 0
            });
          } else {
            // If no profile exists yet, create one
            const newProfile = {
              id: session.user.id,
              name: session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              role: 'customer' as 'customer' | 'admin',
              points: 50 // Welcome bonus
            };
            
            await supabase.from('profiles').insert(newProfile);
            setUser(newProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back to Brew Buddy!",
      });
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (authError) throw authError;
      
      // Create a profile entry in the profiles table
      if (authData.user) {
        const newProfile = {
          id: authData.user.id,
          name,
          email,
          role: 'customer',
          points: 50 // Welcome bonus
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(newProfile);
          
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Registration successful",
        description: "Welcome to Brew Buddy! You received 50 bonus points.",
      });
      
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
