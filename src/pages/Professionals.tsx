
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Building2, Construction, Zap, Pipette, Thermometer, Flame, Bug, Droplet, FlaskRound, Radiation, Waves, Fuel, Bike, Hammer } from "lucide-react";
import { ProfessionalType } from "@/types";
import { Link } from "react-router-dom";
import { professionalData } from "@/components/professionals/data";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Define the categories and their icons
const professionalCategories = [
  { type: "inspector", label: "Home Inspectors", icon: Home },
  { type: "structural", label: "Structural Engineers", icon: Building2 },
  { type: "roofing", label: "Roof Inspectors", icon: Construction },
  { type: "electrical", label: "Electricians", icon: Zap },
  { type: "plumbing", label: "Plumbers", icon: Pipette },
  { type: "hvac", label: "HVAC Technicians", icon: Thermometer },
  { type: "chimney", label: "WETT Inspectors", icon: Flame },
  { type: "pest", label: "Pest Inspectors", icon: Bug },
  { type: "mold", label: "Mold Specialists", icon: Droplet },
  { type: "asbestos", label: "Asbestos & Lead", icon: FlaskRound },
  { type: "radon", label: "Radon Testing", icon: Radiation },
  { type: "septic", label: "Septic Inspectors", icon: Pipette },
  { type: "well", label: "Well Water Testing", icon: Waves },
  { type: "oil", label: "Oil Tank Inspectors", icon: Fuel },
  { type: "pool", label: "Pool Inspectors", icon: Bike },
  { type: "contractor", label: "General Contractors", icon: Hammer },
];

const MAX_PREVIEW_ITEMS = 3; // Number of professionals to show in preview

const Professionals = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inspector");
  
  const handleSearch = () => {
    toast({
      title: "Searching professionals",
      description: `Finding results for "${searchTerm}"`,
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Find Real Estate Professionals</h1>
      
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Professionals</CardTitle>
            <CardDescription>
              Find inspectors, contractors, lawyers, and other real estate professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="Search by name, service, or location" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Tabs 
          defaultValue="inspector" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {professionalCategories.slice(0, 8).map((category) => (
              <TabsTrigger key={category.type} value={category.type}>
                <category.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              {professionalCategories.slice(8, 16).map((category) => (
                <TabsTrigger key={category.type} value={category.type}>
                  <category.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {professionalCategories.map((category) => (
            <TabsContent key={category.type} value={category.type}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" /> {category.label}
                  </CardTitle>
                  <CardDescription>
                    Find qualified {category.label.toLowerCase()} for your real estate needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Preview list of professionals in this category */}
                  {professionalData.professionals
                    .filter(pro => pro.category === category.type)
                    .slice(0, MAX_PREVIEW_ITEMS)
                    .map((professional) => (
                      <div key={professional.id} className="flex items-center justify-between py-4 border-b last:border-0">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{professional.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{professional.name}</h3>
                            <p className="text-sm text-muted-foreground">{professional.expertise}</p>
                          </div>
                        </div>
                        <Link to={`/professionals/${category.type}/${professional.id}`}>
                          <Button size="sm" variant="outline">Details</Button>
                        </Link>
                      </div>
                    ))}
                  
                  {/* If there are no professionals in this category */}
                  {professionalData.professionals.filter(pro => pro.category === category.type).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No professionals found in this category.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link to={`/professionals/${category.type}`} className="w-full">
                    <Button variant="default" className="w-full">
                      View All {category.label}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Professionals;
