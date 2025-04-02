
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Coffee } from '@/types/coffee';

const ManageCoffees = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState<Coffee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: ''
  });
  
  const fetchCoffees = async (): Promise<Coffee[]> => {
    const { data, error } = await supabase
      .from('coffees')
      .select('*')
      .order('name') as { data: Coffee[] | null; error: any };
      
    if (error) {
      console.error('Error fetching coffees:', error);
      throw error;
    }
    
    return data as Coffee[];
  };
  
  const { data: coffees, isLoading, refetch } = useQuery({
    queryKey: ['coffees'],
    queryFn: fetchCoffees,
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image_url: ''
    });
  };
  
  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
    setFormData({
      name: coffee.name,
      description: coffee.description || '',
      price: coffee.price.toString(),
      image_url: coffee.image_url || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (coffee: Coffee) => {
    setSelectedCoffee(coffee);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddCoffee = async () => {
    try {
      const { error } = await supabase
        .from('coffees')
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url: formData.image_url || null
        }) as { error: any };
        
      if (error) throw error;
      
      toast({
        title: "Coffee added",
        description: "New coffee has been added successfully",
      });
      
      refetch();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add coffee",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateCoffee = async () => {
    if (!selectedCoffee) return;
    
    try {
      const { error } = await supabase
        .from('coffees')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url: formData.image_url || null
        })
        .eq('id', selectedCoffee.id) as { error: any };
        
      if (error) throw error;
      
      toast({
        title: "Coffee updated",
        description: "Coffee has been updated successfully",
      });
      
      refetch();
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update coffee",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCoffee = async () => {
    if (!selectedCoffee) return;
    
    try {
      const { error } = await supabase
        .from('coffees')
        .delete()
        .eq('id', selectedCoffee.id) as { error: any };
        
      if (error) throw error;
      
      toast({
        title: "Coffee deleted",
        description: "Coffee has been deleted successfully",
      });
      
      refetch();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete coffee",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container p-4 mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Manage Coffees</h1>
      </div>
      
      <Button 
        onClick={openAddDialog} 
        className="mb-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add New Coffee
      </Button>
      
      {isLoading ? (
        <div className="flex justify-center my-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coffees?.map(coffee => (
            <Card key={coffee.id}>
              <CardHeader>
                <CardTitle>{coffee.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-2">{coffee.description}</p>
                <p className="font-bold mb-4">${coffee.price.toFixed(2)}</p>
                
                {coffee.image_url && (
                  <img 
                    src={coffee.image_url} 
                    alt={coffee.name} 
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                
                <div className="flex space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(coffee)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => openDeleteDialog(coffee)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Coffee</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new coffee to your menu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Cappuccino"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the coffee..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price"
                name="price" 
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="4.99"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input 
                id="image_url"
                name="image_url" 
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCoffee}>
              Add Coffee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coffee</DialogTitle>
            <DialogDescription>
              Update the details of this coffee.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input 
                id="edit-price"
                name="price" 
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">Image URL (optional)</Label>
              <Input 
                id="edit-image_url"
                name="image_url" 
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCoffee}>
              Update Coffee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coffee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCoffee?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoffee}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCoffees;
