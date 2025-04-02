
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coffee, Users, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="text-lg mb-6">Welcome, {user?.name}! You're logged in as an admin.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Coffee className="mr-2 h-5 w-5" />
              Coffee Management
            </CardTitle>
            <CardDescription>Add, edit, and remove coffees</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/coffees">
              <Button className="w-full" variant="default">Manage Coffees</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Management
            </CardTitle>
            <CardDescription>View and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Link to="/">
          <Button variant="link">Return to Main App</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
