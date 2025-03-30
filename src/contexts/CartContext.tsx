
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: 'small' | 'medium' | 'large';
  options: string[];
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('brewBuddyCart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('brewBuddyCart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      // Check if item already exists in cart
      const existingItemIndex = currentItems.findIndex(item => 
        item.id === newItem.id && 
        item.size === newItem.size && 
        JSON.stringify(item.options) === JSON.stringify(newItem.options)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        
        toast({
          title: "Cart updated",
          description: `${newItem.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        });
        
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        toast({
          title: "Added to cart",
          description: `${newItem.name} added to your cart`,
        });
        
        return [...currentItems, newItem];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.id === id);
      const updatedItems = currentItems.filter(item => item.id !== id);
      
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart`,
        });
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = items.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      totalItems, 
      subtotal 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
