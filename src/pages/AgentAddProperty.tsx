
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AgentSidebar from "@/components/AgentSidebar";

interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  property_type: string;
  status: string;
  description: string;
  image_url: string;
}

const AgentAddProperty = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    location: "",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    property_type: "apartment",
    status: "vacant",
    description: "",
    image_url: ""
  });

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData: PropertyFormData) => {
      // Get current agent from localStorage
      const agentSession = localStorage.getItem('agentSession');
      if (!agentSession) {
        throw new Error('No agent session found. Please log in again.');
      }

      const currentAgent = JSON.parse(agentSession);
      console.log('Adding property for agent:', currentAgent.id);

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title,
          location: propertyData.location,
          price: parseFloat(propertyData.price),
          bedrooms: parseInt(propertyData.bedrooms),
          bathrooms: parseInt(propertyData.bathrooms),
          property_type: propertyData.property_type,
          status: propertyData.status,
          description: propertyData.description,
          agent_id: currentAgent.id,
          images: propertyData.image_url ? [propertyData.image_url] : null
        }])
        .select();
      
      if (error) {
        console.error('Property insert error:', error);
        throw error;
      }
      
      console.log('Property added successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      toast({
        title: "Success",
        description: "Property registered successfully!"
      });
      setFormData({
        title: "",
        location: "",
        price: "",
        bedrooms: "1",
        bathrooms: "1",
        property_type: "apartment",
        status: "vacant",
        description: "",
        image_url: ""
      });
    },
    onError: (error: any) => {
      console.error('Add property error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register property. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        description: "Please enter a valid monthly rent amount.",
        variant: "destructive"
      });
      return;
    }

    addPropertyMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Property</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Image */}
              <div>
                <Label htmlFor="image_url" className="text-sm font-medium text-gray-700">
                  Property Image
                </Label>
                <div className="mt-2">
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    placeholder="Enter image URL"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a URL for the property image</p>
                </div>
              </div>

              {/* Property Name and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Property Name *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g. Sunset Apartments Block A"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g. Westlands, Nairobi"
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              {/* Monthly Rent and Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Monthly Rent (KSH) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="25000"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="property_type" className="text-sm font-medium text-gray-700">
                    Property Type *
                  </Label>
                  <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select type" />
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

              {/* Bedrooms, Bathrooms and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                    Bedrooms *
                  </Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">
                    Bathrooms *
                  </Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Bathroom</SelectItem>
                      <SelectItem value="2">2 Bathrooms</SelectItem>
                      <SelectItem value="3">3 Bathrooms</SelectItem>
                      <SelectItem value="4">4+ Bathrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status *
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacant">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the property features, amenities, etc."
                  rows={4}
                  className="mt-2"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={addPropertyMutation.isPending}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 text-lg font-medium"
                >
                  {addPropertyMutation.isPending ? "Registering Property..." : "Register Property"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentAddProperty;
