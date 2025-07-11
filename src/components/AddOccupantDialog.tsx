
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useAgentProperties } from "@/hooks/useAgentData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface AddOccupantDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddOccupantDialog = ({ isOpen, onClose }: AddOccupantDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    property_id: "",
    rent_amount: ""
  });

  const { data: properties = [] } = useAgentProperties();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addOccupantMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('occupants')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          property_id: data.property_id,
          rent_amount: parseFloat(data.rent_amount),
          start_date: new Date().toISOString().split('T')[0],
          status: 'active'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-occupants'] });
      toast({
        title: "Success",
        description: "Occupant added successfully!"
      });
      onClose();
      setFormData({
        name: "",
        email: "",
        phone: "",
        property_id: "",
        rent_amount: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add occupant. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.property_id || !formData.rent_amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    addOccupantMutation.mutate(formData);
  };

  const selectedProperty = properties.find(p => p.id === formData.property_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Add New Occupant</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter occupant name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Property Occupied</Label>
              <Select 
                value={formData.property_id} 
                onValueChange={(value) => handleInputChange('property_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Property Location</Label>
              <Input
                id="location"
                value={selectedProperty?.location || ""}
                placeholder="Property location"
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select disabled>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder={selectedProperty?.property_type || "Select property type"} />
                </SelectTrigger>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rent">Rent (KSH)</Label>
            <Input
              id="rent"
              type="number"
              value={formData.rent_amount}
              onChange={(e) => handleInputChange('rent_amount', e.target.value)}
              placeholder="Enter monthly rent amount"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              disabled={addOccupantMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addOccupantMutation.isPending}
              className="bg-gray-800 hover:bg-gray-900 text-white"
            >
              {addOccupantMutation.isPending ? "Adding..." : "Add Occupant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOccupantDialog;
