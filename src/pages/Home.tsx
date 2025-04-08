
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Coffee, 
  Gift, 
  TrendingUp, 
  Map
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CoffeeSteam: React.FC = () => (
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex space-x-1">
    <div className="steam" style={{ animationDelay: '0.2s' }}></div>
    <div className="steam" style={{ animationDelay: '0.6s' }}></div>
    <div className="steam" style={{ animationDelay: '0.9s' }}></div>
  </div>
);

const Home: React.FC = () => {
  // Get user info from auth context, handle possible null case
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Coffee Lover';
  const userPoints = user?.points || 0;

  return (
    <div className="container py-6 space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Your coffee journey continues with Brew Buddy.
          </p>
        </div>
        
        <div className="relative mt-6 overflow-hidden rounded-md border">
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 h-32 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center z-10">
                <p className="text-lg font-semibold">Reward Points</p>
                <p className="text-3xl font-bold">{userPoints}</p>
                <p className="text-sm opacity-90">5 more points until your next free coffee!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Button asChild className="bg-amber-800 hover:bg-amber-700">
            <Link to="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>
      </section>
      
      {/* Features section - simplified for testing */}
      <section className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Coffee className="mr-2 h-6 w-6" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Button asChild>
            <Link to="/menu">Browse Menu</Link>
          </Button>
          <Button asChild>
            <Link to="/locations">Find Shops</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
