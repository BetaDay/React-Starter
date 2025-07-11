import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Clock,
} from "lucide-react";

import { useProperties } from "@/hooks/useProperties";
import PropertyCard from "@/components/PropertyCard";
import HeroCarousel from "@/components/HeroCarousel";
import Profile from "@/components/profile";
import Footer from "@/components/footer";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Chatbot from "../components/Chatbot";

const Index = () => {
  const { data: properties = [], isLoading } = useProperties();
  const [showChatbot, setShowChatbot] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.offsetHeight || 0;
      setShowChatbot(scrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredProperties = properties.slice(0, 3).map((property) => ({
    id: property.id,
    title: property.title,
    location: property.location,
    price: `KSh ${property.price?.toLocaleString()}`,
    period: "/month",
    rating: 4.5,
    reviews: Math.floor(Math.random() * 50) + 1,
    image: property.images?.[0] || "/placeholder.svg",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms || 1,
    area: `${property.bedrooms * 50} sqm`,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero section with ref */}
      <div ref={heroRef}>
        <HeroCarousel />
      </div>

      {/* Featured Properties Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Properties
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked properties just for you
              </p>
            </div>
            <Link to="/properties">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                View All Properties
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading properties...</p>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                       <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>


              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No properties available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">
                Check back later for new listings!
              </p>
            </div>
          )}
        </div>
      </section>

      <Profile />
      <TestimonialCarousel />

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Pata House?
            </h2>
            <p className="text-lg text-gray-600">
              We make finding and renting properties easy and secure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
              <p className="text-gray-600">
                All properties are thoroughly verified and inspected for quality
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
              <p className="text-gray-600">
                Join thousands of satisfied tenants and landlords
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Process</h3>
              <p className="text-gray-600">
                Find and secure your property in just a few clicks
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {showChatbot && <Chatbot />}
    </div>
  );
};

export default Index;
