import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, Phone, Mail, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { professionalData } from "./data";

const ProfessionalsList = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Find the category information
  const categoryInfo = professionalData.categories.find(c => c.type === category);
  
  if (!categoryInfo) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Category Not Found</h1>
        <div className="flex justify-center">
          <Link to="/professionals">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Professionals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get professionals for this category
  const professionals = professionalData.professionals.filter(
    p => p.category === category && 
    (searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.expertise.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filter above
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Link to="/professionals" className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{categoryInfo.label}</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search {categoryInfo.label}</CardTitle>
          <CardDescription>
            Find the right professional for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              placeholder="Search by name or expertise" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Professionals</CardTitle>
          <CardDescription>
            {professionals.length} professionals found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Company Name</TableHead>
                  <TableHead>Area of Expertise</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell className="font-medium">{professional.name}</TableCell>
                    <TableCell>{professional.expertise}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{professional.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/professionals/${category}/${professional.id}`}>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {professionals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No professionals found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalsList;
