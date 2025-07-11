
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/AgentSidebar";
import PropertyForm from "@/components/PropertyForm";
import { 
  Search,
  Plus,
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Edit,
  Eye
} from "lucide-react";
import { useAgentProperties } from "@/hooks/useAgentData";

const AgentViewProperties = () => {
  const { data: properties = [], isLoading } = useAgentProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      vacant: "bg-green-100 text-green-800",
      occupied: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800"
    };
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
  };

  const handleEditProperty = (property: any) => {
    setSelectedProperty(property);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setSelectedProperty(null);
    setIsEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AgentSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading properties...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AgentSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">View Properties</h1>
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={property.images?.[0] || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusBadge(property.status)}>
                      {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {property.location}
                    </div>
                    <div className="flex items-center space-x-4 text-gray-600 text-sm">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms} Bed
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} Bath
                      </div>
                    </div>
                    <div className="flex items-center text-gray-900 font-semibold">
                      <DollarSign className="h-4 w-4 mr-1" />
                      KSh {property.price?.toLocaleString()}/month
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {property.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProperty(property)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No properties found</h3>
                <p className="text-sm">
                  {searchTerm ? "Try adjusting your search criteria" : "Start by adding your first property"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <PropertyForm 
        property={null}
        onSave={() => setIsAddDialogOpen(false)}
        onCancel={() => setIsAddDialogOpen(false)}
        isOpen={isAddDialogOpen}
      />

      <PropertyForm 
        property={selectedProperty}
        onSave={handleCloseEditDialog}
        onCancel={handleCloseEditDialog}
        isOpen={isEditDialogOpen}
      />
    </div>
  );
};

export default AgentViewProperties;
