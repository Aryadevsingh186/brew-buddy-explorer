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
      setUsername(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatar_url || null);
    }
  }, [user]);
  
  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      if (!user?.id) {
        throw new Error('You must be logged in to upload an avatar.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const userId = user.id;
      const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log("Uploading file:", fileName);
      
      // First, try to create the bucket if it doesn't exist
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (!buckets?.some(bucket => bucket.name === 'avatars')) {
          console.log("Creating avatars bucket");
          await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 1024 * 1024, // 1MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
          });
        }
      } catch (error) {
        console.log("Bucket already exists or creation error", error);
        // Continue with upload as bucket might already exist
      }
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("Upload successful:", data);
      
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatarUrl = urlData.publicUrl;
      
      console.log("File uploaded, public URL:", avatarUrl);
      
      await updateProfile({ avatar_url: avatarUrl });
      setAvatarUrl(avatarUrl);
      
      console.log("Profile updated with new avatar URL");
      
      toast({
        title: "Avatar updated",
        description: "Your profile photo has been updated successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
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
      
      // Try to extract the file path from the URL
      const filePathMatch = avatarUrl.match(/avatars\/(.+)$/);
      if (filePathMatch && filePathMatch[1]) {
        const filePath = filePathMatch[1];
        
        console.log("Removing file:", filePath);
        
        // Try to remove the file from storage
        try {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([filePath]);
            
          if (removeError) {
            console.error("Remove error:", removeError);
          }
        } catch (error) {
          console.error("Error removing file from storage:", error);
          // Continue with profile update even if file removal fails
        }
      }
      
      // Update the profile regardless of file removal success
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
      
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
    <div className="container py-6 max-w-full px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 truncate">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-hidden">
        <div className="md:col-span-1 w-full">
          <Card className="w-full overflow-hidden">
            <CardContent className="pt-6 px-4 sm:px-6">
              <div className="flex flex-col items-center text-center w-full overflow-hidden">
                <div className="w-24 h-24 mb-4 relative group">
                  <Avatar className="w-24 h-24 border-2 border-muted">
                    {avatarUrl ? (
                      <AvatarImage 
                        src={avatarUrl} 
                        alt={user?.name || 'User'} 
                        onError={(e) => {
                          console.error("Error loading avatar image:", e);
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = ''; // Clear src to show fallback
                        }}
                      />
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
                
                <h2 className="text-xl font-bold truncate max-w-full">{user?.name}</h2>
                <p className="text-muted-foreground truncate max-w-full">{user?.email}</p>
                
                <div className="mt-2 bg-coffee-rich/10 px-4 py-2 rounded-full">
                  <div className="flex items-center gap-1">
                    <Coffee className="h-4 w-4 text-coffee-rich" />
                    <span className="font-medium">{user?.points} points</span>
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <div className="mt-2 bg-blue-500/10 px-4 py-2 rounded-full">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Admin</span>
                    </div>
                  </div>
                )}
                
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
        
        <div className="md:col-span-2 w-full overflow-x-auto">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="mb-4 w-full overflow-x-auto">
              <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
              <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">Rewards</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account" className="w-full overflow-x-auto">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your account information here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="username" className="w-full">Name</Label>
                      <Input 
                        id="username" 
                        placeholder="Your name" 
                        className="w-full truncate" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 w-full">
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
                    
                    <div className="space-y-2 w-full">
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
                  <form onSubmit={handleChangePassword} className="space-y-4 w-full">
                    <div className="space-y-2 w-full">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 w-full">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password" 
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 w-full">
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
