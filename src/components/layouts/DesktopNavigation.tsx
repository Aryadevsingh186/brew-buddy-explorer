
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Home, Map, User, QrCode, Settings, ShoppingBag } from 'lucide-react';

interface DesktopNavigationProps {
  isAdmin: boolean;
}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ isAdmin }) => {
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
  );
};

export default DesktopNavigation;
