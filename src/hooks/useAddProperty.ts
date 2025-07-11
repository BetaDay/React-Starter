
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyFormData {
  title: string;
  description: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  property_type: string;
  status: string;
  images: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  location: "",
  bedrooms: 1,
  bathrooms: 1,
  price: "",
  property_type: "apartment",
  status: "vacant",
  images: ""
};

export const useAddProperty = (onSuccess: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

  const addPropertyMutation = useMutation({
    mutationFn: async (propertyData: PropertyFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to add properties');
      }

      const { data: agent, error: agentError } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (agentError || !agent) {
        console.error('Agent lookup error:', agentError);
        throw new Error('Agent profile not found. Please contact support.');
      }

      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title,
          description: propertyData.description || null,
          location: propertyData.location,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          price: parseFloat(propertyData.price),
          property_type: propertyData.property_type,
          status: propertyData.status,
          agent_id: agent.id,
          images: propertyData.images ? [propertyData.images] : null
        }])
        .select();
      
      if (error) {
        console.error('Property insert error:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      toast({
        title: "Success",
        description: "Property added successfully!"
      });
      setFormData(initialFormData);
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Add property error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add property. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateAndSubmit = () => {
    if (!formData.title.trim() || !formData.location.trim() || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Location, Price).",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    addPropertyMutation.mutate(formData);
  };

  return {
    formData,
    handleInputChange,
    validateAndSubmit,
    isLoading: addPropertyMutation.isPending
  };
};
