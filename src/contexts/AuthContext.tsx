import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  points: number;
  avatar_url?: string | null;
}

interface ProfileUpdates {
  name?: string;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdates) => Promise<void>;
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
        console.log("Checking for existing session...");
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Session found:", session.user.id);
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
          
          console.log("Profile data:", profile);
          
          // Set user state with profile data - ensure role is either 'customer' or 'admin'
          setUser({
            id: session.user.id,
            name: profile.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: (profile.role === 'admin' ? 'admin' : 'customer') as 'customer' | 'admin',
            points: profile.points || 0,
            avatar_url: profile.avatar_url || null
          });
        } else {
          console.log("No active session found");
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
        console.log("Auth state change event:", event);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("User signed in:", session.user.id);
          
          // Get user profile upon sign in
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!error && profile) {
            console.log("Profile found:", profile);
            setUser({
              id: session.user.id,
              name: profile.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (profile.role === 'admin' ? 'admin' : 'customer') as 'customer' | 'admin',
              points: profile.points || 0,
              avatar_url: profile.avatar_url || null
            });
          } else {
            console.log("Profile not found or error:", error);
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
          console.log("User signed out");
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
      console.log("Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Login successful, session:", data.session);
      
      toast({
        title: "Login successful",
        description: "Welcome back to Brew Buddy!",
      });
      
    } catch (error: any) {
      console.error("Login error caught:", error.message);
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
      console.log("Attempting registration for:", email);
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        throw error;
      }
      
      console.log("Registration successful, user:", data.user);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Brew Buddy! You received 50 bonus points.",
      });
      
    } catch (error: any) {
      console.error("Registration error caught:", error.message);
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
      console.log("Attempting logout");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        throw error;
      }
      
      console.log("Logout successful");
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error caught:", error.message);
      toast({
        title: "Logout failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updates: ProfileUpdates) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      console.log("Updating profile for user:", user.id, updates);
      
      // Update the user profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        console.error("Profile update error:", error.message);
        throw error;
      }
      
      // Update the local user state with the new data
      setUser({
        ...user,
        ...updates
      });
      
      console.log("Profile updated successfully");
      
    } catch (error: any) {
      console.error("Profile update error caught:", error.message);
      toast({
        title: "Update failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
      throw error;
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
      logout,
      updateProfile
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
