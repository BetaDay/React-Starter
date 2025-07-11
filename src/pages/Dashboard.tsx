
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Home, 
  Heart, 
  MessageSquare, 
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Bed,
  Bath
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  images?: string[];
  bedrooms: number;
  bathrooms?: number;
  property_type?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedProperties();
    }
  }, [user]);

  const fetchSavedProperties = async () => {
    if (!user) return;
    
    try {
      // For now, we'll show some example properties since we don't have a saved_properties table yet
      // In a real implementation, you would fetch from a saved_properties table
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'vacant')
        .limit(6);

      if (error) {
        console.error('Error fetching properties:', error);
        toast({
          title: "Error",
          description: "Failed to load saved properties",
          variant: "destructive"
        });
        return;
      }

      setSavedProperties(properties || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Saved Properties", value: savedProperties.length.toString(), icon: Heart, color: "text-red-500" },
    { title: "Applications", value: "3", icon: MessageSquare, color: "text-blue-500" },
    { title: "Viewings", value: "5", icon: Calendar, color: "text-green-500" },
    { title: "Messages", value: "8", icon: MessageSquare, color: "text-purple-500" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back!
          </h1>
          <p className="text-gray-600 mt-2">
            Find your perfect home and manage your saved properties
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="saved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved">Saved Properties</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>Your Saved Properties</span>
                  </CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                    <a href="/properties">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Properties
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {savedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProperties.map((property) => (
                      <div key={property.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <img 
                          src={property.images?.[0] || '/placeholder.svg'} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold mb-2">{property.title}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1" />
                              {property.bedrooms} Bed
                            </div>
                            {property.bathrooms && (
                              <div className="flex items-center">
                                <Bath className="h-4 w-4 mr-1" />
                                {property.bathrooms} Bath
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-orange-500">KSh {property.price.toLocaleString()}</span>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/property/${property.id}`}>
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved properties yet</h3>
                    <p className="text-gray-500 mb-4">Start browsing properties and save your favorites!</p>
                    <Button className="bg-orange-500 hover:bg-orange-600" asChild>
                      <a href="/properties">Browse Properties</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No applications yet. Apply for properties you're interested in!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet. Start a conversation with landlords!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
