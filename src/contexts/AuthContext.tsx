
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('brewBuddyUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo login logic (replace with actual API in production)
      if (email === 'user@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Demo User',
          email: 'user@example.com',
          role: 'customer',
          points: 150
        };
        setUser(userData);
        localStorage.setItem('brewBuddyUser', JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: "Welcome back to Brew Buddy!",
        });
      } else if (email === 'admin@example.com' && password === 'admin') {
        const userData: User = {
          id: '2',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          points: 999
        };
        setUser(userData);
        localStorage.setItem('brewBuddyUser', JSON.stringify(userData));
        toast({
          title: "Admin login successful",
          description: "Welcome back, Admin!",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo registration (replace with actual API in production)
      if (email === 'user@example.com') {
        throw new Error('Email already in use');
      }
      
      const userData: User = {
        id: Date.now().toString(),
        name,
        email,
        role: 'customer',
        points: 50 // Welcome bonus
      };
      
      setUser(userData);
      localStorage.setItem('brewBuddyUser', JSON.stringify(userData));
      
      toast({
        title: "Registration successful",
        description: "Welcome to Brew Buddy! You received 50 bonus points.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('brewBuddyUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
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
