
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Wifi, 
  Car, 
  Shield, 
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading, error } = usePropertyDetail(id || '');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <Link to="/properties" className="text-orange-500 hover:text-orange-600">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["/placeholder.svg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      vacant: "bg-green-100 text-green-800",
      occupied: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800"
    };
    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/properties" className="text-orange-500 hover:text-orange-600">
            ← Back to Properties
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-6">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img 
                  src={images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusBadge(property.status || 'vacant')}>
                    {property.status?.charAt(0).toUpperCase() + property.status?.slice(1) || 'Available'}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Property Type: {property.property_type}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSaved(!isSaved)}
                    className={isSaved ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${isSaved ? 'fill-red-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2 text-gray-500" />
                  <span>{property.property_type}</span>
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Description */}
              {property.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {amenity === 'WiFi' && <Wifi className="h-3 w-3 mr-1" />}
                        {amenity === 'Parking' && <Car className="h-3 w-3 mr-1" />}
                        {amenity === 'Security' && <Shield className="h-3 w-3 mr-1" />}
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-orange-500">
                      KSh {property.price?.toLocaleString()}
                    </span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Apply Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      Schedule Viewing
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contact Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Agent Card */}
              {property.agents && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                        {property.agents.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="font-semibold">{property.agents.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{property.agents.experience_years} years experience</span>
                        </div>
                        {property.agents.license_number && (
                          <div className="text-xs text-gray-500">
                            License: {property.agents.license_number}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Phone className="h-4 w-4 mr-2" />
                        {property.agents.phone}
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        {property.agents.email}
                      </Button>
                      {property.agents.location && (
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.agents.location}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-center">
                      Interactive map would be<br />integrated here with<br />Google Maps API
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
