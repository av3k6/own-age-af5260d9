
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Building2, Construction, Zap, Pipette, Thermometer, Flame, Bug, Droplet, FlaskRound, Radiation, Waves, Fuel, Bike, Hammer } from "lucide-react";
import { ProfessionalType } from "@/types";
import { Link } from "react-router-dom";

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
                  <div className="grid gap-4">
                    <Link to={`/professionals/${category.type}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        View All {category.label}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Professionals;
