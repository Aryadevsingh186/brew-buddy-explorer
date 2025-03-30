
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingBag, Trash2, Plus, Minus, Clock, CreditCard, Smartphone } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const OrderForm: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'mobile'>('credit');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order placed successfully!",
        description: `Your order will be ready for ${orderType} soon.`,
      });
      
      // Clear cart after successful order
      clearCart();
      setSpecialInstructions('');
    } catch (error) {
      toast({
        title: "Order failed",
        description: "There was an error processing your order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateTax = () => (subtotal * 0.08).toFixed(2);
  const calculateTotal = () => (subtotal + parseFloat(calculateTax()) + (orderType === 'delivery' ? 2.99 : 0)).toFixed(2);
  
  if (items.length === 0) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        <div className="max-w-md mx-auto text-center py-12">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add items from our menu to get started
          </p>
          <Button asChild className="bg-coffee-rich hover:bg-coffee-rich/90">
            <a href="/menu">Browse Menu</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Your Order</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start py-4 border-b last:border-b-0">
                    <div 
                      className="w-16 h-16 rounded bg-center bg-cover mr-4 hidden sm:block" 
                      style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}
                    ></div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.name}</h3>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                        {item.options.length > 0 && ` • ${item.options.join(', ')}`}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center">{item.quantity}</span>
                          
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <form onSubmit={handleSubmitOrder}>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Order Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <RadioGroup 
                    value={orderType} 
                    onValueChange={(value) => setOrderType(value as 'pickup' | 'delivery')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Pickup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Delivery (+$2.99)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {orderType === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input id="address" placeholder="Enter your address" required />
                  </div>
                )}
                
                {orderType === 'pickup' && (
                  <div className="space-y-2">
                    <Label>Pickup Time</Label>
                    <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>Estimated ready in 15-20 minutes</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special requests?"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(value) => setPaymentMethod(value as 'credit' | 'mobile')}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className={`border rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer ${
                      paymentMethod === 'credit' ? 'border-coffee-rich bg-muted' : 'border-border'
                    }`}>
                      <CreditCard className={`h-5 w-5 ${
                        paymentMethod === 'credit' ? 'text-coffee-rich' : 'text-muted-foreground'
                      }`} />
                      <RadioGroupItem value="credit" id="credit" className="sr-only" />
                      <Label 
                        htmlFor="credit" 
                        className={`text-sm cursor-pointer ${
                          paymentMethod === 'credit' ? 'font-medium' : ''
                        }`}
                      >
                        Credit Card
                      </Label>
                    </div>
                    <div className={`border rounded-md p-3 flex flex-col items-center gap-2 cursor-pointer ${
                      paymentMethod === 'mobile' ? 'border-coffee-rich bg-muted' : 'border-border'
                    }`}>
                      <Smartphone className={`h-5 w-5 ${
                        paymentMethod === 'mobile' ? 'text-coffee-rich' : 'text-muted-foreground'
                      }`} />
                      <RadioGroupItem value="mobile" id="mobile" className="sr-only" />
                      <Label 
                        htmlFor="mobile" 
                        className={`text-sm cursor-pointer ${
                          paymentMethod === 'mobile' ? 'font-medium' : ''
                        }`}
                      >
                        Mobile Pay
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${calculateTax()}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-coffee-rich hover:bg-coffee-rich/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-r-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Place Order • $${calculateTotal()}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
