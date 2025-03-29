
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProfessionalType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Professionals = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // This is a placeholder. In a real app, you'd fetch professionals from the database
  const handleSearch = () => {
    toast({
      title: "Coming Soon",
      description: "The professionals search feature is currently under development.",
    });
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Find Real Estate Professionals</h1>
      
      <div className="max-w-3xl mx-auto">
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
        
        <Tabs defaultValue="inspector">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="inspector">Inspectors</TabsTrigger>
            <TabsTrigger value="contractor">Contractors</TabsTrigger>
            <TabsTrigger value="lawyer">Lawyers</TabsTrigger>
            <TabsTrigger value="appraiser">Appraisers</TabsTrigger>
          </TabsList>
          
          {(['inspector', 'contractor', 'lawyer', 'appraiser'] as ProfessionalType[]).map((type) => (
            <TabsContent key={type} value={type}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{type}s</CardTitle>
                  <CardDescription>
                    Find qualified {type}s for your real estate needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      This feature is coming soon! Check back later for a list of {type}s.
                    </p>
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
