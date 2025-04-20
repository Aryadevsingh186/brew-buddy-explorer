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
    name: "Classic Espresso",
    description: "Rich and bold single shot of espresso",
    basePrice: 2.99,
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe",
    tags: ["hot", "classic"],
    category: "coffee"
  },
  {
    id: "2",
    name: "Vanilla Latte",
    description: "Espresso with steamed milk and vanilla syrup",
    basePrice: 4.99,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213",
    tags: ["hot", "classic", "milk", "sweet"],
    category: "coffee"
  },
  {
    id: "3",
    name: "Caramel Macchiato",
    description: "Espresso with steamed milk and caramel drizzle",
    basePrice: 5.29,
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2",
    tags: ["hot", "milk", "sweet"],
    category: "coffee"
  },
  {
    id: "4",
    name: "Mocha Frappuccino",
    description: "Blended coffee with chocolate and whipped cream",
    basePrice: 5.99,
    image: "https://images.unsplash.com/photo-1577595166653-c4b06b30fa18",
    tags: ["cold", "blended", "chocolate"],
    category: "coffee"
  },
  {
    id: "5",
    name: "Cold Brew",
    description: "Smooth, slow-steeped cold coffee",
    basePrice: 4.79,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
    tags: ["cold", "strong"],
    category: "coffee"
  },
  {
    id: "6",
    name: "Green Tea Latte",
    description: "Japanese matcha green tea with steamed milk",
    basePrice: 4.99,
    image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002",
    tags: ["hot", "tea", "milk"],
    category: "tea"
  },
  {
    id: "7",
    name: "Earl Grey Tea",
    description: "Classic black tea with bergamot",
    basePrice: 3.49,
    image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9",
    tags: ["hot", "tea", "classic"],
    category: "tea"
  },
  {
    id: "8",
    name: "Chai Tea Latte",
    description: "Spiced black tea with steamed milk",
    basePrice: 4.79,
    image: "https://images.unsplash.com/photo-1557006021-b94410ed0b44",
    tags: ["hot", "tea", "milk", "spiced"],
    category: "tea"
  },
  {
    id: "9",
    name: "Strawberry Açai Refresher",
    description: "Cool strawberry açai drink with real fruit pieces",
    basePrice: 4.99,
    image: "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e",
    tags: ["cold", "fruity", "refreshing"],
    category: "refreshment"
  },
  {
    id: "10",
    name: "Mango Dragon Fruit Lemonade",
    description: "Tropical dragon fruit and mango with lemonade",
    basePrice: 5.29,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd",
    tags: ["cold", "fruity", "refreshing"],
    category: "refreshment"
  },
  {
    id: "11",
    name: "Cinnamon Dolce Latte",
    description: "Espresso with cinnamon-sweet syrup and steamed milk",
    basePrice: 5.49,
    image: "https://images.unsplash.com/photo-1579494398610-e14c8d079333",
    tags: ["hot", "sweet", "milk"],
    category: "coffee"
  },
  {
    id: "12",
    name: "Iced Coconut Americano",
    description: "Chilled espresso with coconut water",
    basePrice: 4.99,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0907980",
    tags: ["cold", "refreshing"],
    category: "coffee"
  },
  {
    id: "13",
    name: "Peach Green Tea",
    description: "Green tea blend with peach essence",
    basePrice: 3.99,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc",
    tags: ["cold", "tea", "fruity"],
    category: "tea"
  },
  {
    id: "14",
    name: "Berry Hibiscus Refresher",
    description: "Hibiscus tea with mixed berry flavors",
    basePrice: 4.89,
    image: "https://images.unsplash.com/photo-1622483767028-3f66869433c7",
    tags: ["cold", "fruity", "refreshing"],
    category: "refreshment"
  },
  {
    id: "15",
    name: "Pumpkin Spice Latte",
    description: "Espresso with pumpkin spice and steamed milk",
    basePrice: 5.79,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d",
    tags: ["hot", "seasonal", "milk"],
    category: "coffee"
  },
  {
    id: "16",
    name: "White Chocolate Mocha",
    description: "Espresso with white chocolate and steamed milk",
    basePrice: 5.49,
    image: "https://images.unsplash.com/photo-1585494156145-5c348ccd8c19",
    tags: ["hot", "sweet", "milk"],
    category: "coffee"
  },
  {
    id: "17",
    name: "Jasmine Pearl Tea",
    description: "Premium jasmine-scented green tea",
    basePrice: 3.99,
    image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2",
    tags: ["hot", "tea", "floral"],
    category: "tea"
  },
  {
    id: "18",
    name: "Nitro Cold Brew",
    description: "Nitrogen-infused cold brew coffee",
    basePrice: 5.29,
    image: "https://images.unsplash.com/photo-1568769493121-c7c9061fd269",
    tags: ["cold", "strong", "smooth"],
    category: "coffee"
  }
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
  }
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
