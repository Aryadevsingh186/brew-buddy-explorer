
export interface MenuItem {
  id: string;
  name: string;
  basePrice: number;
  image: string;
  description?: string;
  tags?: string[];
  category?: string;
}

// Re-export the coffee type for convenience
export * from './coffee';
