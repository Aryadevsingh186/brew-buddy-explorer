
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Coffee, Gift, History, QrCode, LogOut, Camera, Upload, Trash2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      getProfile();
    }
  }, [user]);
  
  async function getProfile() {
    try {
      if (!user?.id) return;
      
      // Check if we already have the avatar in storage
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }
      
      if (profileData?.avatar_url) {
        setAvatarUrl(profileData.avatar_url);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }
  
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;
      
      // Update the user's profile with the avatar URL
      await updateProfile({ avatar_url: avatarUrl });
      
      setAvatarUrl(avatarUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }
  
  async function removeAvatar() {
    try {
      setUploading(true);
      
      if (!avatarUrl) return;
      
      // Extract the file name from the URL
      const filePathMatch = avatarUrl.match(/avatars\/(.+)$/);
      if (filePathMatch && filePathMatch[1]) {
        const filePath = filePathMatch[1];
        
        // Remove the file from storage
        const { error: removeError } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (removeError) {
          throw removeError;
        }
      }
      
      // Update the user's profile to remove avatar URL
      await updateProfile({ avatar_url: null });
      
      setAvatarUrl(null);
      toast({
        title: "Avatar removed",
        description: "Your profile photo has been removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Remove failed",
        description: error.message || "There was an error removing your photo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({ name: username });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your password",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Mock order history
  const orderHistory = [
    {
      id: "ORD-1234",
      date: "2023-07-15",
      total: 15.99,
      items: ["Caramel Macchiato", "Blueberry Muffin"],
      status: "Completed"
    },
    {
      id: "ORD-5678",
      date: "2023-07-10",
      total: 12.50,
      items: ["Cold Brew", "Croissant"],
      status: "Completed"
    },
    {
      id: "ORD-9012",
      date: "2023-07-05",
      total: 9.25,
      items: ["Cappuccino", "Chocolate Chip Cookie"],
      status: "Completed"
    }
  ];
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 mb-4 relative group">
                  <Avatar className="w-24 h-24 border-2 border-muted">
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={user?.name || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-coffee-mocha/20 text-coffee-mocha">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-black/50 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={uploadAvatar}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                
                {avatarUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-3" 
                    onClick={removeAvatar}
                    disabled={uploading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Photo
                  </Button>
                )}
                
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
                
                <div className="mt-2 bg-coffee-rich/10 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-1">
                    <Coffee className="h-4 w-4 text-coffee-rich" />
                    <span className="font-medium">{user?.points} points</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="mt-6 w-full"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
              
              <Separator className="my-6" />
              
              <nav className="space-y-1">
                <a href="#account" className="flex items-center px-3 py-2 rounded-md text-sm bg-muted font-medium">
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </a>
                <a href="#notifications" className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </a>
                <a href="#security" className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </a>
                <a href="#rewards" className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <Gift className="mr-2 h-4 w-4" />
                  Rewards
                </a>
                <a href="#orders" className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted">
                  <History className="mr-2 h-4 w-4" />
                  Order History
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="account">
            <TabsList className="mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account information here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Name</Label>
                      <Input 
                        id="username" 
                        placeholder="Your name" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your phone number" />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-coffee-rich hover:bg-coffee-rich/90"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-coffee-rich hover:bg-coffee-rich/90"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View your recent orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{order.id}</h3>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            {order.status}
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm">{order.items.join(", ")}</p>
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="rewards">
              <Card>
                <CardHeader>
                  <CardTitle>Rewards & Points</CardTitle>
                  <CardDescription>
                    View and redeem your reward points
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-coffee-rich/10 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Your Points</h3>
                        <div className="text-3xl font-bold">{user?.points}</div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-coffee-rich flex items-center justify-center">
                        <Coffee className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="text-sm mb-1">Next Reward: Free Coffee (50 more points)</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-coffee-rich h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (user?.points || 0) / 2)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-4">Available Rewards</h3>
                  
                  <div className="space-y-3">
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Free Coffee</h4>
                        <p className="text-sm text-muted-foreground">200 points</p>
                      </div>
                      <Button variant="outline" disabled={user?.points! < 200}>
                        Redeem
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Free Pastry</h4>
                        <p className="text-sm text-muted-foreground">150 points</p>
                      </div>
                      <Button variant="outline" disabled={user?.points! < 150}>
                        Redeem
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">$5 Off</h4>
                        <p className="text-sm text-muted-foreground">300 points</p>
                      </div>
                      <Button variant="outline" disabled={user?.points! < 300}>
                        Redeem
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Button className="w-full bg-coffee-rich hover:bg-coffee-rich/90">
                    <Gift className="mr-2 h-4 w-4" />
                    View Loyalty Program
                  </Button>
                  <Button variant="outline" className="w-full">
                    <QrCode className="mr-2 h-4 w-4" />
                    My Loyalty QR Code
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-updates">Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your orders
                      </p>
                    </div>
                    <Switch id="order-updates" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="promotions">Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about deals and discounts
                      </p>
                    </div>
                    <Switch id="promotions" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="rewards-updates">Rewards Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about your rewards and points
                      </p>
                    </div>
                    <Switch id="rewards-updates" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive our weekly newsletter
                      </p>
                    </div>
                    <Switch id="newsletter" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-coffee-rich hover:bg-coffee-rich/90">
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
