
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Grid, Map, Home, Users } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useAllProperties } from "@/hooks/useProperties";

const Houses = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");

  const { data: dbProperties = [], isLoading } = useAllProperties();

  // Transform database properties to match the expected format
  const allProperties = dbProperties.map(prop => ({
    id: prop.id,
    title: prop.title,
    location: prop.location,
    price: `KSh ${prop.price?.toLocaleString()}`,
    period: "/month",
    rating: 4.5,
    reviews: Math.floor(Math.random() * 50) + 10,
    image: prop.images?.[0] || "/placeholder.svg",
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms || 1,
    area: `${prop.bedrooms * 50} sqm`,
    status: prop.status as 'vacant' | 'occupied'
  }));

  const filteredProperties = allProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    const matchesBedrooms = bedroomFilter === "all" || property.bedrooms.toString() === bedroomFilter;
    
    return matchesSearch && matchesStatus && matchesBedrooms;
  });

  const vacantProperties = filteredProperties.filter(p => p.status === "vacant");
  const occupiedProperties = filteredProperties.filter(p => p.status === "occupied");

  const getStatusBadge = (status: string) => {
    return status === "vacant" 
      ? <Badge className="bg-green-100 text-green-800">Available</Badge>
      : <Badge className="bg-red-100 text-red-800">Occupied</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            All Properties
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Browse through all properties on our platform - both available and occupied
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-3xl font-bold text-gray-900">{allProperties.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available Properties</p>
                    <p className="text-3xl font-bold text-green-600">{vacantProperties.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <Home className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupied Properties</p>
                    <p className="text-3xl font-bold text-red-600">{occupiedProperties.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <Filter className="h-5 w-5 mr-2 text-orange-500" />
                  <h3 className="text-lg font-semibold">Filters</h3>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search properties..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Property Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Properties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Properties</SelectItem>
                        <SelectItem value="vacant">Available Only</SelectItem>
                        <SelectItem value="occupied">Occupied Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setBedroomFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  <Grid className="h-4 w-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={viewMode === 'map' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  <Map className="h-4 w-4 mr-1" />
                  Map
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                Showing {filteredProperties.length} of {allProperties.length} properties
              </div>
            </div>

            {/* Properties Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="relative">
                    <PropertyCard property={property} />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(property.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Map view would be integrated here with Google Maps API</p>
              </div>
            )}

            {/* No Results */}
            {filteredProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No properties found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Houses;
