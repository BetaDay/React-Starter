
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  Search,
  Eye,
  Edit,
  Trash2,
  Check,
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { title: "Total Properties", value: "1,234", change: "+12%", icon: Home, color: "text-blue-600" },
    { title: "Active Users", value: "5,678", change: "+8%", icon: Users, color: "text-green-600" },
    { title: "Monthly Revenue", value: "KSh 2.4M", change: "+15%", icon: TrendingUp, color: "text-orange-600" },
    { title: "Pending Approvals", value: "23", change: "-5%", icon: AlertCircle, color: "text-red-600" }
  ];

  const properties = [
    {
      id: 1,
      title: "Modern 2BR Apartment",
      location: "Westlands, Nairobi",
      price: "KSh 45,000",
      status: "active",
      landlord: "John Doe",
      dateAdded: "2024-01-15"
    },
    {
      id: 2,
      title: "Luxury Villa with Garden",
      location: "Karen, Nairobi",
      price: "KSh 120,000",
      status: "pending",
      landlord: "Jane Smith",
      dateAdded: "2024-01-14"
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      location: "Kilimani, Nairobi",
      price: "KSh 25,000",
      status: "active",
      landlord: "Mike Johnson",
      dateAdded: "2024-01-13"
    }
  ];

  const users = [
    {
      id: 1,
      name: "Alice Wanjiku",
      email: "alice@example.com",
      type: "tenant",
      joinDate: "2023-12-01",
      status: "active"
    },
    {
      id: 2,
      name: "Bob Kimani",
      email: "bob@example.com",
      type: "landlord",
      joinDate: "2023-11-15",
      status: "active"
    },
    {
      id: 3,
      name: "Carol Muthoni",
      email: "carol@example.com",
      type: "tenant",
      joinDate: "2024-01-10",
      status: "pending"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your Pata House platform</p>
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
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Property Management</CardTitle>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search properties..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Property</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Price</th>
                        <th className="text-left p-4">Landlord</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{property.title}</p>
                              <p className="text-sm text-gray-500">Added {property.dateAdded}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{property.location}</td>
                          <td className="p-4 font-medium">{property.price}</td>
                          <td className="p-4 text-gray-600">{property.landlord}</td>
                          <td className="p-4">
                            <Badge className={getStatusBadge(property.status)}>
                              {property.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {property.status === 'pending' && (
                                <>
                                  <Button variant="ghost" size="sm" className="text-green-600">
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Type</th>
                        <th className="text-left p-4">Join Date</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <p className="font-medium">{user.name}</p>
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {user.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-gray-600">{user.joinDate}</td>
                          <td className="p-4">
                            <Badge className={getStatusBadge(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart would be integrated here with Recharts</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chart would be integrated here with Recharts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
