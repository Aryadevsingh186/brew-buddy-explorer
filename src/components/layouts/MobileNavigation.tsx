
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Home, Map, User, QrCode, Settings, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavigationProps {
  isAdmin: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isAdmin }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/menu', label: 'Menu', icon: <Coffee size={20} /> },
    { path: '/order', label: 'Order', icon: <ShoppingBag size={20} /> },
    { path: '/locations', label: 'Locations', icon: <Map size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
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
  );
};

export default MobileNavigation;
