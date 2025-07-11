import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/AdminSidebar";
import {
  Users,
  Home,
  UserCheck,
  Building,
  Bell,
  Menu,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAdminStats, useAdminProperties } from "@/hooks/useAdminData";

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: properties, isLoading: propertiesLoading } = useAdminProperties();

  const vacancyData =
    properties?.reduce((acc: any[], property) => {
      if (property.status === "vacant") {
        const existingLocation = acc.find(
          (item) => item.location === property.location
        );
        if (existingLocation) {
          existingLocation.vacancy += 1;
        } else {
          acc.push({ location: property.location, vacancy: 1 });
        }
      }
      return acc;
    }, []) || [];

  const occupancyData = [
    {
      name: "Occupied",
      value: stats?.occupiedProperties || 0,
      color: "#0ea5e9",
    },
    {
      name: "Vacant",
      value: stats?.vacantProperties || 0,
      color: "#f97316",
    },
  ];

  const dashboardStats = [
    {
      title: "Total Properties",
      value: stats?.totalProperties?.toString() || "0",
      subtitle: "Listed properties",
      icon: Home,
      color: "text-green-500",
    },
    {
      title: "Vacant Houses",
      value: stats?.vacantProperties?.toString() || "0",
      subtitle: "Available for rent",
      icon: Building,
      color: "text-orange-500",
    },
    {
      title: "Active Agents",
      value: stats?.totalAgents?.toString() || "0",
      subtitle: "Verified property agents",
      icon: UserCheck,
      color: "text-purple-500",
    },
    {
      title: "Total Occupants",
      value: stats?.totalOccupants?.toString() || "0",
      subtitle: "Active tenants",
      icon: Users,
      color: "text-blue-500",
    },
  ];

  if (statsLoading || propertiesLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Header */}
        <div className="bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage your Pata House platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed((prev) => !prev)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 text-white rounded-full p-2">
                <span className="font-bold text-sm">A</span>
              </div>
              <div>
                <p className="font-medium text-sm">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
            <p className="text-gray-600">Welcome back! Here's what's happening with Pata House today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Vacancy Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Property Vacancy by Location</CardTitle>
                <p className="text-sm text-gray-600">Number of vacant properties across locations</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {vacancyData.length > 0 ? (
                    <ResponsiveContainer width="50%" height="100%">
                      <BarChart data={vacancyData}>
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Bar
                          dataKey="vacancy"
                          fill="#f97316"
                          barSize={40}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No vacancy data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Property Occupancy</CardTitle>
                <p className="text-sm text-gray-600">Current occupancy status across all properties</p>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={occupancyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-4 space-x-6">
                  {occupancyData.map((entry, idx) => (
                    <div className="flex items-center" key={entry.name}>
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm">
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
