
import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Coffee, ShoppingBag, Home, Map, User, QrCode, Menu as MenuIcon, ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const AppLayout: React.FC = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/menu', label: 'Menu', icon: <Coffee size={20} /> },
    { path: '/order', label: 'Order', icon: <ShoppingBag size={20} /> },
    { path: '/locations', label: 'Locations', icon: <Map size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="flex items-center space-x-2">
              <Coffee className="h-6 w-6 text-coffee-rich" />
              <span className="font-bold text-xl text-coffee-rich">Brew Buddy</span>
            </Link>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center mb-8">
                  <Coffee className="h-6 w-6 text-coffee-rich mr-2" />
                  <span className="font-bold text-xl text-coffee-rich">Brew Buddy</span>
                </div>
                
                <nav className="space-y-2 flex-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        isActive(item.path) 
                          ? 'bg-coffee-mocha text-white' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/scan"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                      isActive('/scan') 
                        ? 'bg-coffee-mocha text-white' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <QrCode size={20} />
                    Scan QR
                  </Link>
                  
                  {/* Admin link for mobile */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        location.pathname.startsWith('/admin') 
                          ? 'bg-coffee-mocha text-white' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <Settings size={20} />
                      Admin Panel
                    </Link>
                  )}
                </nav>
                
                <div className="border-t pt-4">
                  <div className="px-3 py-2">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                    <div className="text-sm font-medium text-coffee-caramel mt-1">
                      {user?.points} points
                    </div>
                    {user?.role === 'admin' && (
                      <div className="text-xs font-medium text-green-600 mt-1">
                        Administrator
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2" 
                    onClick={logout}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Mobile logo */}
          <div className="flex items-center justify-center flex-1 md:hidden">
            <Link to="/" className="flex items-center">
              <Coffee className="h-6 w-6 text-coffee-rich" />
              <span className="font-bold text-xl text-coffee-rich ml-2">Brew Buddy</span>
            </Link>
          </div>
          
          {/* Cart button */}
          <div className="flex items-center justify-end flex-1 md:justify-center">
            <Link to="/order" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 px-1 min-w-5 h-5 flex items-center justify-center" 
                    variant="default"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4 ml-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  isActive(item.path) 
                    ? 'bg-coffee-mocha text-white' 
                    : 'hover:bg-muted'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <Link 
              to="/scan"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/scan') 
                  ? 'bg-coffee-mocha text-white' 
                  : 'hover:bg-muted'
              }`}
            >
              <QrCode size={20} />
              <span>Scan QR</span>
            </Link>
            
            {/* Admin link for desktop */}
            {isAdmin && (
              <Link 
                to="/admin"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname.startsWith('/admin') 
                    ? 'bg-coffee-mocha text-white' 
                    : 'hover:bg-muted bg-amber-100'
                }`}
              >
                <Settings size={20} />
                <span>Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Bottom navigation for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-40">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive(item.path) 
                  ? 'text-coffee-rich' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
