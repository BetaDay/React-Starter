
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Chatbot from "@/components/Chatbot";

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+254 700 123 456", "+254 722 987 654"],
      description: "Mon-Fri 8AM-6PM, Sat 9AM-4PM"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@patahouse.co.ke", "support@patahouse.co.ke"],
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["Pata House Towers", "Westlands, Nairobi"],
      description: "Visit our office for in-person assistance"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon-Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      description: "Sunday: Closed"
    }
  ];

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-orange-600 mb-6">
            Contact PataHouse
          </h1>
         
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="Richard" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Mangia" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="richard@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input placeholder="+254 700 000 000" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="How can we help you?" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..."
                    className="h-32"
                  />
                </div>
                
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-600 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the following channels. Our team is ready 
                to assist you with all your property rental needs.
              </p>
            </div>

            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-transparent p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 font-medium">
                          {detail}
                        </p>
                      ))}
                      <p className="text-gray-600 text-sm mt-1">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* FAQ Link */}
            <Card className="bg-transparent border border-gray-200">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Looking for Quick Answers?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out our frequently asked questions section for instant help.
                </p>
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white">
                  Visit FAQ Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-600 text-center mb-8">
            Find Our Office
          </h2>
          <Card>
            <CardContent className="p-0">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Interactive Map Integration</p>
                  <p className="text-gray-400">Google Maps would be integrated here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Contact;
