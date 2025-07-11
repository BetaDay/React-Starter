import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";
import PropertyForm, { PropertyFormData } from "@/components/PropertyForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdminProperties } from "@/hooks/useAdminData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  price: string;
  agent: string;
  agentPhone: string;
  status: 'vacant' | 'occupied';
  image: string;
}

const AdminProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyFormData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: dbProperties = [], isLoading } = useAdminProperties();

  // Transform database properties to match the expected format
  const properties: Property[] = dbProperties.map(prop => ({
    id: prop.id,
    title: prop.title,
    location: prop.location,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms || 1,
    property_type: prop.property_type || 'apartment',
    price: `KSh ${prop.price?.toLocaleString()}`,
    agent: prop.agents?.name || 'Unknown Agent',
    agentPhone: prop.agents?.phone || 'N/A',
    status: prop.status as 'vacant' | 'occupied',
    image: prop.images?.[0] || '/placeholder.svg'
  }));

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete property.",
        variant: "destructive",
      });
    }
  });

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.agent.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesBedrooms = bedroomFilter === "all" || property.bedrooms.toString() === bedroomFilter;
    
    return matchesSearch && matchesStatus && matchesBedrooms;
  });

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleEditProperty = (property: Property) => {
    const numericPrice = property.price.replace(/[^\d.]/g, ''); // string format

    const transformed: PropertyFormData = {
      id: property.id,
      title: property.title,
      location: property.location,
      price: numericPrice,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      property_type: property.property_type,
      status: property.status === 'occupied' ? 'occupied' : 'vacant',
      description: '',
      image_url: property.image,
    };

    setEditingProperty(transformed);
    setShowForm(true);
  };

  const handleSaveProperty = () => {
    // Refresh the properties list after saving
    queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['all-properties'] });
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleDeleteClick = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (propertyToDelete) {
      deletePropertyMutation.mutate(propertyToDelete.id);
    }
    setShowDeleteDialog(false);
    setPropertyToDelete(null);
  };

  const handleViewProperty = (property: Property) => {
    toast({
      title: "Property Details",
      description: `Viewing details for ${property.title}`,
    });
    console.log('View property details:', property);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your Pata House platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 text-white rounded-full p-2">
                  <span className="font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Admin User</p>
                  <p className="text-xs text-gray-500">admin@patahouse.com</p>
                </div>
                <Button variant="ghost" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Property Management</h2>
              <p className="text-gray-600">Manage property listings and landlord information</p>
            </div>
            <Button 
              onClick={handleAddProperty}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties by title, address, or agent..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="vacant">Vacant</option>
              <option value="occupied">Occupied</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={bedroomFilter}
              onChange={(e) => setBedroomFilter(e.target.value)}
            >
              <option value="all">All Room Types</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedroom</option>
              <option value="3">3 Bedroom</option>
              <option value="4">4+ Bedroom</option>
            </select>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      property.status === 'vacant' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{property.bedrooms} bedrooms</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{property.price}</p>
                      <p className="text-sm text-gray-500">per month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{property.agent}</p>
                      <p className="text-xs text-gray-500">{property.agentPhone}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProperty(property)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(property)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results Message */}
          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No properties found matching your criteria</p>
              <Button onClick={handleAddProperty} className="bg-gray-900 hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Property
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Property Form Modal */}
      <PropertyForm
        property={editingProperty}
        onSave={handleSaveProperty}
        onCancel={() => {
          setShowForm(false);
          setEditingProperty(null);
        }}
        isOpen={showForm}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteDialog(false);
          setPropertyToDelete(null);
        }}
      />
    </div>
  );
};

export default AdminProperties;
