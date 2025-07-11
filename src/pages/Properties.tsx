
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { MapPin, Filter, Grid, Map } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import Chatbot from "@/components/Chatbot";

const Properties = () => {
  const { data: properties = [], isLoading } = useProperties();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [priceRange, setPriceRange] = useState([10000, 200000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("any");

  // Filter properties based on search criteria
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesType = selectedType === "all" || property.property_type === selectedType;
    const matchesBedrooms = selectedBedrooms === "any" || 
                           (selectedBedrooms === "4+" ? property.bedrooms >= 4 : 
                            property.bedrooms === parseInt(selectedBedrooms));
    
    return matchesSearch && matchesPrice && matchesType && matchesBedrooms;
  });

  // Transform properties for PropertyCard component
  const transformedProperties = filteredProperties.map(property => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: `KSh ${property.price?.toLocaleString()}`,
    period: "/month",
    rating: 4.5, // Default rating
    reviews: Math.floor(Math.random() * 50) + 1, // Random reviews
    image: property.images?.[0] || "/placeholder.svg",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms || 1,
    area: `${property.bedrooms * 50} sqm` // Estimated area
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Properties for Rent
          </h1>
          <p className="text-lg text-gray-600">
            {filteredProperties.length} properties available
          </p>
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
                  {/* Location Search */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="Search by title or location" 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Property Type</label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200000}
                      min={10000}
                      step={5000}
                      className="mt-2"
                    />
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Bedrooms</label>
                    <Select value={selectedBedrooms} onValueChange={setSelectedBedrooms}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1 Bedroom</SelectItem>
                        <SelectItem value="2">2 Bedrooms</SelectItem>
                        <SelectItem value="3">3 Bedrooms</SelectItem>
                        <SelectItem value="4+">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("all");
                      setSelectedBedrooms("any");
                      setPriceRange([10000, 200000]);
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

              <Select defaultValue="newest">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Properties Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformedProperties.length > 0 ? (
                  transformedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-600 text-lg mb-2">No properties found</p>
                    <p className="text-gray-500">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <p className="text-gray-500">Map view coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Properties;
