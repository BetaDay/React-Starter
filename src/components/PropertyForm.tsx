import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface PropertyFormData {
  id?: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  description?: string;
  image_url: string;
}

interface PropertyFormProps {
  property?: PropertyFormData | null;
  onSave: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const PropertyForm = ({ property, onSave, onCancel, isOpen }: PropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    property_type: 'apartment',
    status: 'vacant' as 'vacant' | 'occupied' | 'maintenance',
    description: '',
    image_url: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        price: property.price?.toString() || '',
        bedrooms: property.bedrooms || 1,
        bathrooms: property.bathrooms || 1,
        property_type: property.property_type || 'apartment',
        status: property.status || 'vacant',
        description: property.description || '',
        image_url: property.image_url || ''
      });
    } else {
      setFormData({
        title: '',
        location: '',
        price: '',
        bedrooms: 1,
        bathrooms: 1,
        property_type: 'apartment',
        status: 'vacant',
        description: '',
        image_url: ''
      });
    }
  }, [property]);

  const savePropertyMutation = useMutation({
    mutationFn: async (propertyData: typeof formData) => {
      const agentSession = localStorage.getItem('agentSession');
      if (!agentSession) {
        throw new Error('No agent session found');
      }
      const currentAgent = JSON.parse(agentSession);

      const dataToSave = {
        title: propertyData.title,
        location: propertyData.location,
        price: parseFloat(propertyData.price),
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        property_type: propertyData.property_type,
        status: propertyData.status,
        description: propertyData.description,
        images: propertyData.image_url ? [propertyData.image_url] : null,
        agent_id: currentAgent.id
      };

      if (property?.id) {
        const { error } = await supabase
          .from('properties')
          .update(dataToSave)
          .eq('id', property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('properties')
          .insert(dataToSave);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      toast({
        title: "Success",
        description: property ? "Property updated successfully" : "Property created successfully",
      });
      onSave();
    },
    onError: (error: any) => {
      console.error('Save property error:', error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.location.trim() || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid rent amount.",
        variant: "destructive"
      });
      return;
    }

    savePropertyMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-orange-500 text-xl">
            {property ? 'Modify Property' : 'Add New Property'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="property_name" className="text-sm font-medium">
                Property Name *
              </Label>
              <Input
                id="property_name"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter Location"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rent" className="text-sm font-medium">
                Rent *
              </Label>
              <Input
                id="rent"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter Price"
                required
              />
            </div>
            <div>
              <Label htmlFor="room_type" className="text-sm font-medium">
                Room Type *
              </Label>
              <Select value={formData.property_type} onValueChange={(value) => setFormData({ ...formData, property_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms" className="text-sm font-medium">
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="text-sm font-medium">
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div>
              <Label htmlFor="estate" className="text-sm font-medium">
                Estate *
              </Label>
              <Select value={formData.status} onValueChange={(value: 'vacant' | 'occupied' | 'maintenance') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacant">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter Description"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Upload Photos</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-2">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">
                  Drag your images here, or{' '}
                  <span className="text-orange-500 cursor-pointer">browse</span>
                </div>
                <div className="text-xs text-gray-500">
                  Supported: JPG, JPEG, PNG
                </div>
              </div>
              <Input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Or enter image URL"
                className="mt-4"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              disabled={savePropertyMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
            >
              {savePropertyMutation.isPending ? 'Saving...' : 'Modify Property'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyForm;
