import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Utensils, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RestaurantDashboardProps {
  user: any;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ user }) => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: ""
  });

  useEffect(() => {
    loadFoodItems();
  }, [user.id]);

  const loadFoodItems = async () => {
    const { data } = await supabase
      .from('food_items')
      .select('*')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false });
    setFoodItems(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      partner_id: user.id
    };

    if (editingItem) {
      const { error } = await supabase
        .from('food_items')
        .update(data)
        .eq('id', editingItem.id);
      
      if (!error) {
        toast({
          title: "Food Item Updated",
          description: "Your food item has been updated successfully.",
        });
      }
    } else {
      const { error } = await supabase
        .from('food_items')
        .insert(data);
      
      if (!error) {
        toast({
          title: "Food Item Added",
          description: "Your food item has been added successfully.",
        });
      }
    }

    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ name: "", description: "", price: "", category: "", image_url: "" });
    loadFoodItems();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category || "",
      image_url: item.image_url || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id);

    if (!error) {
      toast({
        title: "Food Item Deleted",
        description: "Food item has been removed successfully.",
      });
      loadFoodItems();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Food Menu Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ name: "", description: "", price: "", category: "", image_url: "" });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Food Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Food Item" : "Add New Food Item"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Food Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Enter food name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                      placeholder="Describe the dish"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                      placeholder="Enter price"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizer">Appetizer</SelectItem>
                        <SelectItem value="main_course">Main Course</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({...prev, image_url: e.target.value}))}
                      placeholder="Enter image URL"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {editingItem ? "Update Food Item" : "Add Food Item"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {foodItems.map((item) => (
              <Card key={item.id}>
                {item.image_url && (
                  <div className="h-48 bg-gray-200">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold">₹{item.price}</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {foodItems.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No food items added yet. Click "Add Food Item" to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};