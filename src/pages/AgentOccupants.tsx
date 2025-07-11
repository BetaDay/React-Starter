
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/AgentSidebar";
import { 
  Search,
  Plus,
  Eye,
  Trash2,
  Users
} from "lucide-react";
import { useAgentOccupants } from "@/hooks/useAgentData";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const AgentOccupants = () => {
  const { data: occupants = [], isLoading } = useAgentOccupants();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteOccupantMutation = useMutation({
    mutationFn: async (occupantId: string) => {
      const { error } = await supabase
        .from('occupants')
        .delete()
        .eq('id', occupantId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-occupants'] });
      queryClient.invalidateQueries({ queryKey: ['agent-stats'] });
      toast({
        title: "Success",
        description: "Occupant removed successfully!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove occupant. Please try again.",
        variant: "destructive"
      });
    }
  });

  const filteredOccupants = occupants.filter(occupant => 
    occupant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    occupant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (occupant.properties?.title && occupant.properties.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate stats
  const totalOccupants = occupants.filter(o => o.status === 'active').length;
  const totalRent = occupants
    .filter(o => o.status === 'active')
    .reduce((sum, o) => sum + (o.rent_amount || 0), 0);
  const locations = new Set(occupants.map(o => o.properties?.location).filter(Boolean)).size;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AgentSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading occupants...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Manage Occupants</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Overview Cards */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Occupants Overview</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{totalOccupants}</div>
                  <div className="text-gray-600">Total Occupants</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    KSH {totalRent.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Monthly Rent</div>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{locations}</div>
                  <div className="text-gray-600">Locations</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Current Occupants Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Occupants</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search occupants..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="p-3 font-medium text-gray-600">Name</th>
                      <th className="p-3 font-medium text-gray-600">Email</th>
                      <th className="p-3 font-medium text-gray-600">Phone</th>
                      <th className="p-3 font-medium text-gray-600">Property</th>
                      <th className="p-3 font-medium text-gray-600">Location</th>
                      <th className="p-3 font-medium text-gray-600">Rent</th>
                      <th className="p-3 font-medium text-gray-600">Start Date</th>
                      <th className="p-3 font-medium text-gray-600">Status</th>
                      <th className="p-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOccupants.map((occupant) => (
                      <tr key={occupant.id} className="border-t hover:bg-gray-50">
                        <td className="p-3 font-medium">{occupant.name}</td>
                        <td className="p-3 text-sm text-gray-600">{occupant.email}</td>
                        <td className="p-3 text-sm text-gray-600">{occupant.phone}</td>
                        <td className="p-3 text-sm">
                          {occupant.properties?.title || 'N/A'}
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {occupant.properties?.location || 'N/A'}
                        </td>
                        <td className="p-3 font-medium">
                          KSH {occupant.rent_amount?.toLocaleString() || '0'}
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {formatDate(occupant.start_date)}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            occupant.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {occupant.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="p-1">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteOccupantMutation.mutate(occupant.id)}
                              disabled={deleteOccupantMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOccupants.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No occupants found</h3>
                    <p className="text-sm">
                      {searchTerm 
                        ? "Try adjusting your search criteria" 
                        : "No occupants currently registered for your properties"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentOccupants;
