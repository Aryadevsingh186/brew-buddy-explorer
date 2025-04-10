
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Home, Map, User, ShoppingBag } from 'lucide-react';

const MobileBottomNav: React.FC = () => {
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-40">
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
    </nav>
  );
};

export default MobileBottomNav;
