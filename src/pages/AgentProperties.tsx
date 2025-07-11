
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/AgentSidebar";
import AddPropertyDialog from "@/components/AddPropertyDialog";
import ConfirmDialog from "@/components/ConfirmDialog";
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Bed,
  DollarSign,
  User,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgentProperties } from "@/hooks/useAgentData";

const AgentProperties = () => {
  const { toast } = useToast();
  const { data: properties = [], isLoading } = useAgentProperties();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'vacant' | 'occupied'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; property: any | null }>({
    isOpen: false,
    property: null
  });

  // Filter properties based on search and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProperty = () => {
    setIsAddDialogOpen(true);
  };

  const handleDeleteProperty = (property: any) => {
    setDeleteConfirm({ isOpen: true, property });
  };

  const confirmDelete = () => {
    if (deleteConfirm.property) {
      toast({
        title: "Property Deleted",
        description: `${deleteConfirm.property.title} has been removed successfully.`,
      });
    }
    setDeleteConfirm({ isOpen: false, property: null });
  };

  const getStatusBadge = (status: string) => {
    return status === "vacant" 
      ? "bg-green-100 text-green-800 hover:bg-green-200" 
      : "bg-red-100 text-red-800 hover:bg-red-200";
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
            <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
            <Button onClick={handleAddProperty} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search properties..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'vacant' | 'occupied')}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="vacant">Vacant</option>
                      <option value="occupied">Occupied</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredProperties.length} of {properties.length} properties
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {property.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Bed className="h-4 w-4 mr-2" />
                      {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <DollarSign className="h-4 w-4 mr-2" />
                      KSh {property.price?.toLocaleString()}/month
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProperty(property)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No properties found</h3>
                  <p className="text-sm">
                    {searchTerm || statusFilter !== 'all' 
                      ? "Try adjusting your search or filter criteria" 
                      : "Start by adding your first property"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Property Dialog */}
      <AddPropertyDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteConfirm.property?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, property: null })}
      />
    </div>
  );
};

export default AgentProperties;
