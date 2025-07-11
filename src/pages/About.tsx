
import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, Shield, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Home,
      title: "Wide Property Selection",
      description: "Browse through thousands of verified properties across Nairobi and beyond."
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join a community of verified landlords, agents, and tenants for secure transactions."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and transactions are protected with enterprise-grade security."
    },
    {
      icon: Award,
      title: "Expert Support",
      description: "Get help from our experienced team of real estate professionals."
    }
  ];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About Pata House
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kenya's leading property rental platform connecting tenants, landlords, and agents 
            in a secure and transparent environment.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At Pata House, we're revolutionizing the way people find and rent properties in Kenya. 
                Our mission is to make property rental simple, transparent, and accessible to everyone.
              </p>
              <p className="text-lg text-gray-600">
                We believe that finding a home should be exciting, not stressful. That's why we've 
                built a platform that puts control back in your hands, whether you're a tenant 
                looking for your dream home or a landlord managing your properties.
              </p>
            </div>
            <div className="bg-orange-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600 mb-4">Why Choose Pata House?</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Verified property listings with authentic photos and details
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Direct communication between landlords and tenants
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Secure payment processing and documentation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional agent network for guided assistance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">10,000+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50,000+</div>
              <div className="text-gray-600">Happy Tenants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">2,500+</div>
              <div className="text-gray-600">Verified Landlords</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Professional Agents</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Story
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Founded in 2020, Pata House was born from the frustration of searching for rental 
            properties in Kenya. Our founders experienced firsthand the challenges of dealing 
            with unreliable listings, fake agents, and lack of transparency in the rental market. 
            Today, we're proud to serve thousands of users across Kenya, making property rental 
            a seamless experience for everyone involved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
