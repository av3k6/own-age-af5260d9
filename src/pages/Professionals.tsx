
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Home, Building2, Construction, Zap, Pipette, Thermometer, Flame, Bug, Droplet, FlaskRound, Radiation, Waves, Fuel, Bike, Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { professionalData } from "@/components/professionals/data";

// Map the icon strings to actual Lucide icon components
const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="h-4 w-4 mr-2" />,
  Building2: <Building2 className="h-4 w-4 mr-2" />,
  Construction: <Construction className="h-4 w-4 mr-2" />,
  Zap: <Zap className="h-4 w-4 mr-2" />,
  Pipette: <Pipette className="h-4 w-4 mr-2" />,
  Thermometer: <Thermometer className="h-4 w-4 mr-2" />,
  Flame: <Flame className="h-4 w-4 mr-2" />,
  Bug: <Bug className="h-4 w-4 mr-2" />,
  Droplet: <Droplet className="h-4 w-4 mr-2" />,
  FlaskRound: <FlaskRound className="h-4 w-4 mr-2" />,
  Radiation: <Radiation className="h-4 w-4 mr-2" />,
  Waves: <Waves className="h-4 w-4 mr-2" />,
  Fuel: <Fuel className="h-4 w-4 mr-2" />,
  Bike: <Bike className="h-4 w-4 mr-2" />,
  Hammer: <Hammer className="h-4 w-4 mr-2" />
};

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
            {professionalData.categories.slice(0, 8).map((category) => (
              <TabsTrigger key={category.type} value={category.type}>
                {iconMap[category.icon as keyof typeof iconMap]}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              {professionalData.categories.slice(8, 16).map((category) => (
                <TabsTrigger key={category.type} value={category.type}>
                  {iconMap[category.icon as keyof typeof iconMap]}
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {professionalData.categories.map((category) => (
            <TabsContent key={category.type} value={category.type}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {iconMap[category.icon as keyof typeof iconMap]} {category.label}
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
