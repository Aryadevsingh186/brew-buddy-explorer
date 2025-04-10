
import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Menu as MenuIcon, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import MobileNavigation from './MobileNavigation';
import DesktopNavigation from './DesktopNavigation';

interface HeaderProps {
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin }) => {
  const { totalItems } = useCart();
  
  return (
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
            <MobileNavigation isAdmin={isAdmin} />
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
        
        <DesktopNavigation isAdmin={isAdmin} />
      </div>
    </header>
  );
};

export default Header;
