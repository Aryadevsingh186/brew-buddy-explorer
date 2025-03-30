
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map, Search, Navigation, Coffee, Clock, Phone, Star } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Mock coffee shop data
const coffeeShops = [
  {
    id: 1,
    name: "Downtown Brew Buddy",
    address: "123 Main St, Downtown",
    distance: 0.5,
    rating: 4.8,
    hours: "7:00 AM - 9:00 PM",
    phone: "555-123-4567",
    features: ["Drive-thru", "Patio", "WiFi"]
  },
  {
    id: 2,
    name: "University Corner",
    address: "45 College Ave, University District",
    distance: 1.2,
    rating: 4.6,
    hours: "6:00 AM - 11:00 PM",
    phone: "555-987-6543",
    features: ["Study Room", "24/7", "WiFi"]
  },
  {
    id: 3,
    name: "Westside Roasters",
    address: "789 Market St, Westside",
    distance: 2.4,
    rating: 4.9,
    hours: "8:00 AM - 8:00 PM",
    phone: "555-456-7890",
    features: ["Roastery Tour", "Outdoor Seating", "Dog Friendly"]
  },
  {
    id: 4,
    name: "Eastside Coffee Hub",
    address: "321 Commerce Blvd, Eastside",
    distance: 3.7,
    rating: 4.5,
    hours: "6:30 AM - 7:00 PM",
    phone: "555-789-0123",
    features: ["Drive-thru", "Bakery", "Parking"]
  }
];

const MapView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShops, setFilteredShops] = useState(coffeeShops);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<GeolocationPosition | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFilteredShops(coffeeShops);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = coffeeShops.filter(shop => 
      shop.name.toLowerCase().includes(query) || 
      shop.address.toLowerCase().includes(query)
    );
    
    setFilteredShops(results);
    
    if (results.length === 0) {
      toast({
        title: "No results found",
        description: "Try a different search term",
      });
    }
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation is not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
      return;
    }
    
    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation(position);
        setLocationLoading(false);
        toast({
          title: "Location detected",
          description: "Your current location has been found",
        });
      },
      (error) => {
        setLocationLoading(false);
        let errorMsg = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out";
            break;
        }
        
        toast({
          title: "Location error",
          description: errorMsg,
          variant: "destructive",
        });
      },
      { timeout: 10000 }
    );
  };
  
  const getDirections = (shopId: number) => {
    const shop = coffeeShops.find(s => s.id === shopId);
    if (!shop) return;
    
    toast({
      title: "Getting directions",
      description: `Directions to ${shop.name} will open in your maps app`,
    });
    
    // In a real app, this would open the device's maps app
    console.log(`Getting directions to: ${shop.name}`);
  };
  
  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {Array(5).fill(0).map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < fullStars 
                ? 'text-yellow-500 fill-current' 
                : i === fullStars && hasHalfStar 
                  ? 'text-yellow-500 fill-current' 
                  : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-1 text-sm">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Find a Coffee Shop</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Search</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Location or shop name</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="search" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                  className="w-full"
                >
                  {locationLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-coffee-rich border-r-transparent rounded-full animate-spin mr-2"></div>
                      Detecting location...
                    </>
                  ) : (
                    <>
                      <Navigation className="mr-2 h-4 w-4" />
                      Use my current location
                    </>
                  )}
                </Button>
              </form>
              
              {userLocation && (
                <div className="mt-4 p-2 bg-muted rounded-md text-xs">
                  <p>Location detected:</p>
                  <p>Lat: {userLocation.coords.latitude.toFixed(6)}</p>
                  <p>Long: {userLocation.coords.longitude.toFixed(6)}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Distance</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    Under 1 mile
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Under 5 miles
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Under 10 miles
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Features</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
                    Drive-thru
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    WiFi
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Open Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card className="mb-4">
            <CardContent className="p-0">
              {/* Simulated map display */}
              <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Map className="h-12 w-12 text-muted-foreground" />
                </div>
                
                {/* Map markers */}
                {filteredShops.map((shop) => (
                  <div 
                    key={shop.id}
                    className={`absolute w-6 h-6 rounded-full bg-coffee-rich flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform
                      ${selectedShop === shop.id ? 'ring-2 ring-offset-2 ring-coffee-rich' : ''}
                    `}
                    style={{ 
                      left: `${30 + (shop.id * 15)}%`, 
                      top: `${25 + (shop.distance * 10)}%` 
                    }}
                    onClick={() => setSelectedShop(shop.id)}
                  >
                    <Coffee className="h-3 w-3 text-white" />
                  </div>
                ))}
                
                {/* User location */}
                {userLocation && (
                  <div 
                    className="absolute w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse"
                    style={{ left: '50%', top: '50%' }}
                  >
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            {filteredShops.map((shop) => (
              <Card 
                key={shop.id}
                className={`overflow-hidden transition-shadow ${
                  selectedShop === shop.id ? 'ring-2 ring-coffee-rich' : ''
                }`}
                onClick={() => setSelectedShop(shop.id)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{shop.name}</h3>
                          <p className="text-sm text-muted-foreground">{shop.address}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(shop.id);
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          {shop.distance} mi
                        </Button>
                      </div>
                      
                      <div className="mt-2">
                        {renderRatingStars(shop.rating)}
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{shop.hours}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{shop.phone}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {shop.features.map((feature, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-muted text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
