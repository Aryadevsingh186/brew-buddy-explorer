
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Coffee, Sparkles, CupSoda, Leaf, Milk } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Types
interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  tags: string[];
  category: string;
}

// Mock data
const coffeeProducts: CoffeeProduct[] = [
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
  {
    id: "3",
    name: "Caramel Macchiato",
    description: "Espresso with vanilla syrup, steamed milk and caramel",
    basePrice: 4.99,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f",
    tags: ["hot", "sweet", "milk"],
    category: "coffee"
  },
  {
    id: "4",
    name: "Cold Brew",
    description: "Smooth, cold brewed coffee steeped for 12 hours",
    basePrice: 3.99,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c",
    tags: ["cold", "refreshing"],
    category: "coffee"
  },
  {
    id: "5",
    name: "Matcha Latte",
    description: "Premium matcha green tea with steamed milk",
    basePrice: 5.50,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a",
    tags: ["hot", "tea", "milk"],
    category: "tea"
  },
  {
    id: "6",
    name: "Berry Blast Smoothie",
    description: "Mixed berries, banana and yogurt",
    basePrice: 6.50,
    image: "https://images.unsplash.com/photo-1638176067000-9eea2bffa3b7",
    tags: ["cold", "fruity", "sweet"],
    category: "smoothie"
  },
  {
    id: "7",
    name: "Lemonade",
    description: "Freshly squeezed lemons with a hint of mint",
    basePrice: 3.50,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c3a451",
    tags: ["cold", "refreshing", "tangy"],
    category: "refreshment"
  },
  {
    id: "8",
    name: "Avocado Smoothie",
    description: "Creamy avocado blended with milk and a touch of honey",
    basePrice: 7.50,
    image: "https://images.unsplash.com/photo-1583500178450-e59e4309b57a",
    tags: ["cold", "creamy", "healthy"],
    category: "smoothie"
  }
];

const Menu: React.FC = () => {
  const { addItem } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<CoffeeProduct | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  const handleSelectProduct = (product: CoffeeProduct) => {
    setSelectedProduct(product);
    setSelectedSize('medium');
    setSelectedOptions([]);
    setIsDialogOpen(true);
  };
  
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const sizeMultiplier = selectedSize === 'small' ? 0.8 : selectedSize === 'large' ? 1.2 : 1;
    const optionsPrice = selectedOptions.length * 0.5; // Each option costs $0.50 extra
    
    const finalPrice = (selectedProduct.basePrice * sizeMultiplier) + optionsPrice;
    
    addItem({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: parseFloat(finalPrice.toFixed(2)),
      quantity: 1,
      size: selectedSize,
      options: selectedOptions,
      image: selectedProduct.image
    });
    
    setIsDialogOpen(false);
    toast({
      title: "Added to cart",
      description: `${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)} ${selectedProduct.name} has been added to your cart.`
    });
  };
  
  const toggleOption = (option: string) => {
    setSelectedOptions(prevOptions => 
      prevOptions.includes(option)
        ? prevOptions.filter(o => o !== option)
        : [...prevOptions, option]
    );
  };
  
  const getSizePrice = (basePrice: number, size: string) => {
    if (size === 'small') return (basePrice * 0.8).toFixed(2);
    if (size === 'large') return (basePrice * 1.2).toFixed(2);
    return basePrice.toFixed(2);
  };
  
  const getTotalPrice = () => {
    if (!selectedProduct) return "0.00";
    
    const sizeMultiplier = selectedSize === 'small' ? 0.8 : selectedSize === 'large' ? 1.2 : 1;
    const optionsPrice = selectedOptions.length * 0.5;
    const finalPrice = (selectedProduct.basePrice * sizeMultiplier) + optionsPrice;
    
    return finalPrice.toFixed(2);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coffee': return <Coffee className="h-4 w-4" />;
      case 'tea': return <Leaf className="h-4 w-4" />;
      case 'smoothie': return <Milk className="h-4 w-4" />;
      case 'refreshment': return <CupSoda className="h-4 w-4" />;
      default: return <Coffee className="h-4 w-4" />;
    }
  };
  
  const filterProductsByCategory = (category: string) => {
    if (category === 'all') return coffeeProducts;
    return coffeeProducts.filter(product => product.category === category);
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Our Menu</h1>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="coffee" className="flex items-center gap-1">
            <Coffee className="h-4 w-4" />
            <span>Coffee</span>
          </TabsTrigger>
          <TabsTrigger value="tea" className="flex items-center gap-1">
            <Leaf className="h-4 w-4" />
            <span>Tea</span>
          </TabsTrigger>
          <TabsTrigger value="smoothie" className="flex items-center gap-1">
            <Milk className="h-4 w-4" />
            <span>Smoothies</span>
          </TabsTrigger>
          <TabsTrigger value="refreshment" className="flex items-center gap-1">
            <CupSoda className="h-4 w-4" />
            <span>Refreshments</span>
          </TabsTrigger>
        </TabsList>
        
        {['all', 'coffee', 'tea', 'smoothie', 'refreshment'].map(category => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterProductsByCategory(category).map(product => (
                <div key={product.id} className="coffee-card overflow-hidden">
                  <div 
                    className="h-48 bg-center bg-cover" 
                    style={{ backgroundImage: `url(${product.image})` }}
                  ></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{product.name}</h3>
                      <div className="flex items-center text-sm">
                        {getCategoryIcon(product.category)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="font-semibold">${product.basePrice.toFixed(2)}</div>
                      <Button 
                        onClick={() => handleSelectProduct(product)}
                        className="bg-coffee-rich hover:bg-coffee-rich/90"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customize Your Order</DialogTitle>
            <DialogDescription>
              Make it just the way you like it.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-16 h-16 rounded bg-center bg-cover" 
                  style={{ backgroundImage: `url(${selectedProduct.image})` }}
                ></div>
                <div>
                  <h3 className="font-semibold">{selectedProduct.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Size</h4>
                <RadioGroup 
                  value={selectedSize} 
                  onValueChange={(value) => setSelectedSize(value as 'small' | 'medium' | 'large')}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small">Small ${getSizePrice(selectedProduct.basePrice, 'small')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium ${getSizePrice(selectedProduct.basePrice, 'medium')}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large">Large ${getSizePrice(selectedProduct.basePrice, 'large')}</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Options</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Extra shot', 'Whipped cream', 'Caramel drizzle', 'Sugar-free', 'Almond milk', 'Vanilla syrup'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={option.replace(' ', '-')} 
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={() => toggleOption(option)}
                      />
                      <Label htmlFor={option.replace(' ', '-')} className="text-sm">
                        {option} <span className="text-muted-foreground">(+$0.50)</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="font-semibold">${getTotalPrice()}</div>
                </div>
                <Button onClick={handleAddToCart} className="bg-coffee-rich hover:bg-coffee-rich/90">
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Menu;
