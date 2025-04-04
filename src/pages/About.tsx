
import React from "react";
import { Helmet } from "react-helmet-async";
import { Home, Users, Award, MessageSquare, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Us | TransacZen Haven</title>
        <meta name="description" content="Learn about TransacZen Haven's mission, values, and the team behind our real estate platform." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-zen-gray-900 mb-6">
              About TransacZen Haven
            </h1>
            <p className="text-xl text-zen-gray-600 max-w-3xl mb-8">
              We're transforming the way people buy, sell, and connect in the real estate market
              through innovation, transparency, and a people-first approach.
            </p>
            <div className="flex items-center justify-center space-x-2 text-primary mb-10">
              <Home className="w-5 h-5" />
              <span className="font-medium">Established 2023</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-zen-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-zen-gray-600 mb-6">
                At TransacZen Haven, we believe that finding, buying, or selling a home should be 
                an exciting journey, not a stressful process. Our mission is to simplify real estate 
                transactions and create a seamless experience for all parties involved.
              </p>
              <p className="text-lg text-zen-gray-600">
                We've built a platform that combines innovative technology with personalized 
                service, ensuring that every client receives the attention and support they 
                deserve during one of life's most significant decisions.
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-zen-gray-900">People First</h3>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-zen-gray-900">Excellence</h3>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-zen-gray-900">Integrity</h3>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-zen-gray-900">Transparency</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-zen-gray-900 mb-12">Our Story</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-zen-gray-900 mb-4">The Beginning</h3>
              <p className="text-zen-gray-600">
                TransacZen Haven was founded by a group of real estate professionals and tech 
                innovators who recognized the need for a more efficient, transparent, and 
                user-friendly approach to real estate transactions.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-zen-gray-900 mb-4">Our Growth</h3>
              <p className="text-zen-gray-600">
                Since our launch in 2023, we've helped thousands of clients find their dream homes,
                sell properties at optimal prices, and connect with trusted professionals within
                the industry.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-zen-gray-900 mb-4">Looking Forward</h3>
              <p className="text-zen-gray-600">
                As we continue to grow, we remain committed to our core values and the belief
                that technology should enhance, not replace, the human element in real estate
                transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-zen-gray-900 mb-4">Our Leadership Team</h2>
          <p className="text-center text-zen-gray-600 max-w-2xl mx-auto mb-12">
            Meet the dedicated professionals working behind the scenes to make your real estate experience exceptional.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="CEO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-zen-gray-900">Alexandra Chen</h3>
              <p className="text-primary font-medium mb-2">Chief Executive Officer</p>
              <p className="text-zen-gray-600 text-sm">
                With over 15 years in real estate and technology, Alexandra leads our vision to transform the industry.
              </p>
            </div>
            
            {/* Team Member 2 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="CTO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-zen-gray-900">Marcus Johnson</h3>
              <p className="text-primary font-medium mb-2">Chief Technology Officer</p>
              <p className="text-zen-gray-600 text-sm">
                Marcus brings extensive experience in building scalable platforms that simplify complex processes.
              </p>
            </div>
            
            {/* Team Member 3 */}
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="COO" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-zen-gray-900">Sophia Rodriguez</h3>
              <p className="text-primary font-medium mb-2">Chief Operating Officer</p>
              <p className="text-zen-gray-600 text-sm">
                Sophia ensures our day-to-day operations deliver exceptional value to all our users.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-zen-gray-900 mb-4">Join Us on Our Journey</h2>
          <p className="text-lg text-zen-gray-600 mb-8">
            Whether you're looking to buy, sell, or collaborate with us, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-8 py-3 text-md font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="/professionals" 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background px-8 py-3 text-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Find Professionals
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
