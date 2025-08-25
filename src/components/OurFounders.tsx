import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import rayaanImage from '/public/Rayaan.jpg';
import harsithImage from '/public/harsith.png';

export function OurFounders() {
  const founders = [
    {
      name: 'Rayaan',
      image: rayaanImage,
      email: 'rayaanm5409@gmail.com',
      phone: '+91 84249 33585',
      role: 'Primary Founder & Developer',
      description: ''
    },
    {
      name: 'Harsith',
      image: harsithImage,
      email: 'harsithrajan08@gmail.com',
      phone: '+91 91373 76422',
      role: 'Primary Associate',
      description: ''
    }
  ];

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Founders</h1>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              "To empower the next generation of innovators by making coding and robotics education 
              accessible, engaging, and fun for every child. We believe that through hands-on learning 
              and creative problem-solving, we can inspire young minds to build the future."
            </p>
          </CardContent>
        </Card>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {founders.map((founder) => (
            <Card key={founder.name} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm">👨‍💻</span>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900">{founder.name}</CardTitle>
                <Badge className="mx-auto bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {founder.role}
                </Badge>
                {founder.description && (
                  <CardDescription className="text-base mt-3 text-gray-600">
                    {founder.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-center">Contact for Enquiry</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <Button
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto"
                        onClick={() => handleEmailClick(founder.email)}
                      >
                        {founder.email}
                      </Button>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <Button
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 p-0 h-auto"
                        onClick={() => handlePhoneClick(founder.phone)}
                      >
                        {founder.phone}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleEmailClick(founder.email)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                    onClick={() => handlePhoneClick(founder.phone)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company Vision - trimmed */}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join Our Mission?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Whether you're a parent, educator, or student, we'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleEmailClick('rayaanm5409@gmail.com')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
            <Button
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => window.open('https://www.youtube.com/@MrRoboQuest', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Our Channel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}