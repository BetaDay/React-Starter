
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/AgentSidebar";
import { 
  Search,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useAgentProperties } from "@/hooks/useAgentData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const AgentManageProperties = () => {
  const { data: properties = [], isLoading } = useAgentProperties();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-properties'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      toast({
        title: "Success",
        description: "Property deleted successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive"
      });
    }
  });

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

  const getStatusText = (status: string) => {
    return status === 'vacant' ? 'Available' : status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD format
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Properties</h1>
            <div className="flex items-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Modify Property
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {property.title}
                        </h3>
                        <Badge className={getStatusBadge(property.status)}>
                          {getStatusText(property.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-8 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <div className="font-medium">{property.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Rent:</span>
                          <div className="font-medium">KSH {property.price?.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Details:</span>
                          <div className="font-medium">{property.bedrooms} bed</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-500">
                        Last Updated: {formatDate(property.updated_at || property.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" className="p-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deletePropertyMutation.mutate(property.id)}
                        disabled={deletePropertyMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                  {searchTerm 
                    ? "Try adjusting your search criteria" 
                    : "No properties available"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentManageProperties;
