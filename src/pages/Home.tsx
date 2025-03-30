
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
  const { user } = useAuth();

  return (
    <div className="container py-6 space-y-8">
      {/* Hero section */}
      <section className="relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Your coffee journey continues with Brew Buddy.
          </p>
        </div>
        
        <div className="relative mt-6 overflow-hidden rounded-md border">
          <div className="coffee-gradient h-32 w-full relative">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center z-10">
                <p className="text-lg font-semibold">Reward Points</p>
                <p className="text-3xl font-bold">{user?.points}</p>
                <p className="text-sm opacity-90">5 more points until your next free coffee!</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Button asChild className="bg-coffee-rich hover:bg-coffee-rich/90">
            <Link to="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/order">Order Now</Link>
          </Button>
        </div>
      </section>
      
      {/* Features section */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Coffee className="h-5 w-5 text-coffee-rich" />
              <span>Today's Special</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-hidden rounded-md aspect-[4/3]">
              <div className="absolute inset-0 bg-coffee-espresso/20"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="relative w-20 h-20 mb-4">
                  <div className="w-16 h-16 rounded-full bg-coffee-mocha mx-auto relative">
                    <CoffeeSteam />
                  </div>
                  <div className="w-20 h-10 bg-coffee-espresso rounded-b-full absolute bottom-0 left-0"></div>
                </div>
                <h3 className="text-xl font-bold text-coffee-espresso">Caramel Macchiato</h3>
                <p className="text-sm text-coffee-mocha mt-1">25% off today only!</p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Link to="/menu">View Details</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-coffee-caramel" />
              <span>Rewards</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Free Coffee</h3>
                  <p className="text-sm text-muted-foreground">200 points</p>
                </div>
                <div className="w-20 bg-muted rounded-full h-3">
                  <div 
                    className="bg-coffee-caramel h-3 rounded-full" 
                    style={{ width: `${Math.min(100, (user?.points || 0) / 2)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Birthday Special</h3>
                  <p className="text-sm text-muted-foreground">Unlock at level 3</p>
                </div>
                <div className="w-20 bg-muted rounded-full h-3">
                  <div 
                    className="bg-coffee-caramel h-3 rounded-full" 
                    style={{ width: '30%' }}
                  ></div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-2">
                View All Rewards
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-coffee-mocha" />
              <span>Nearby Locations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-coffee-mocha/20 flex items-center justify-center shrink-0">
                  <Coffee className="h-5 w-5 text-coffee-mocha" />
                </div>
                <div>
                  <h3 className="font-medium">Downtown Cafe</h3>
                  <p className="text-sm text-muted-foreground">0.5 miles away</p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">Open now</span>
                    <span className="text-muted-foreground ml-1">until 9PM</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-coffee-mocha/20 flex items-center justify-center shrink-0">
                  <Coffee className="h-5 w-5 text-coffee-mocha" />
                </div>
                <div>
                  <h3 className="font-medium">University Brew</h3>
                  <p className="text-sm text-muted-foreground">1.2 miles away</p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">Open now</span>
                    <span className="text-muted-foreground ml-1">until 11PM</span>
                  </div>
                </div>
              </div>
              
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <Link to="/locations">View All Locations</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
