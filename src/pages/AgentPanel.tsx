
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import AgentSidebar from "@/components/AgentSidebar";
import { 
  Home, 
  Users, 
  Building,
  Calendar,
  Bell,
  User,
  Search,
  Filter,
  MoreHorizontal,
  MapPin,
  Bed,
  Bath
} from "lucide-react";
import { useAgentStats, useAgentProperties } from "@/hooks/useAgentData";

const AgentPanel = () => {
  const { data: stats, isLoading: statsLoading } = useAgentStats();
  const { data: properties = [], isLoading: propertiesLoading } = useAgentProperties();

  const statsData = [
    { 
      title: "Total Properties", 
      value: stats?.totalProperties?.toString() || "0", 
      subtitle: "Properties managed", 
      icon: Home, 
      bgColor: "bg-blue-50", 
      iconColor: "text-blue-600" 
    },
    { 
      title: "Occupied Properties", 
      value: stats?.occupiedProperties?.toString() || "0", 
      subtitle: `${stats?.totalProperties ? Math.round((stats.occupiedProperties / stats.totalProperties) * 100) : 0}% occupancy rate`, 
      icon: Users, 
      bgColor: "bg-green-50", 
      iconColor: "text-green-600" 
    },
    { 
      title: "Total Occupants", 
      value: stats?.totalOccupants?.toString() || "0", 
      subtitle: "Active tenants", 
      icon: Building, 
      bgColor: "bg-purple-50", 
      iconColor: "text-purple-600" 
    },
    { 
      title: "Vacant Properties", 
      value: stats?.vacantProperties?.toString() || "0", 
      subtitle: "Available for rent", 
      icon: Calendar, 
      bgColor: "bg-orange-50", 
      iconColor: "text-orange-600" 
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      vacant: "bg-green-100 text-green-800",
      occupied: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800"
    };
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
  };

  if (statsLoading || propertiesLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AgentSidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading dashboard...</div>
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
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Building className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.iconColor}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div key={property.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <img
                      src={property.images?.[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{property.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          {property.bedrooms} Bed
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-4 w-4 mr-1" />
                          {property.bathrooms} Bath
                        </div>
                        <div className="font-semibold text-gray-900">
                          KSh {property.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(property.status)}>
                      {property.status?.charAt(0).toUpperCase() + property.status?.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;
