
// This file will handle all API requests for the application
// In a real app, this would connect to a backend server

interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  tags: string[];
  category: string;
}

interface CoffeeShop {
  id: number;
  name: string;
  address: string;
  distance: number;
  rating: number;
  hours: string;
  phone: string;
  features: string[];
  latitude?: number;
  longitude?: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  address?: string;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: 'small' | 'medium' | 'large';
  options: string[];
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock menu data
const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Rich and bold single shot of espresso",
    basePrice: 2.99,
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe",
    tags: ["hot", "classic"],
    category: "coffee"
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso with steamed milk and thick foam",
    basePrice: 4.50,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213",
    tags: ["hot", "classic", "milk"],
    category: "coffee"
  },
  // More items would be here in a real API
];

// Mock coffee shops
const coffeeShops: CoffeeShop[] = [
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
  // More shops would be here in a real API
];

// API functions
export const api = {
  // Menu
  getMenu: async (): Promise<MenuItem[]> => {
    await delay(800); // Simulate network delay
    return menuItems;
  },
  
  getMenuItem: async (id: string): Promise<MenuItem | undefined> => {
    await delay(500);
    return menuItems.find(item => item.id === id);
  },
  
  // Coffee shops
  getCoffeeShops: async (): Promise<CoffeeShop[]> => {
    await delay(1000);
    return coffeeShops;
  },
  
  getCoffeeShopById: async (id: number): Promise<CoffeeShop | undefined> => {
    await delay(500);
    return coffeeShops.find(shop => shop.id === id);
  },
  
  getNearbyCoffeeShops: async (lat: number, lng: number, radius: number): Promise<CoffeeShop[]> => {
    await delay(1500);
    // In a real app, this would filter shops by distance from provided coordinates
    return coffeeShops.sort((a, b) => a.distance - b.distance);
  },
  
  // Orders
  placeOrder: async (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order> => {
    await delay(2000);
    
    return {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
      ...order
    };
  },
  
  getOrderHistory: async (userId: string): Promise<Order[]> => {
    await delay(1000);
    return [
      {
        id: "ORD-1234",
        userId,
        items: [
          {
            id: "1",
            name: "Cappuccino",
            price: 4.50,
            quantity: 1,
            size: "medium",
            options: ["Extra shot", "Almond milk"]
          },
          {
            id: "2",
            name: "Croissant",
            price: 3.25,
            quantity: 1,
            size: "medium",
            options: []
          }
        ],
        total: 7.75,
        status: "completed",
        orderType: "pickup",
        createdAt: "2023-07-15T10:30:00Z"
      }
    ];
  },
  
  // User
  getUserPoints: async (userId: string): Promise<number> => {
    await delay(500);
    return Math.floor(Math.random() * 500); // Mock points
  },
  
  redeemPoints: async (userId: string, rewardId: string): Promise<boolean> => {
    await delay(1500);
    // In a real app, this would deduct points and record the redemption
    return true;
  }
};
