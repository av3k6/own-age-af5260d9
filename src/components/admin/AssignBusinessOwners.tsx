
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { professionalData } from "@/components/professionals/data/professionalData";
import { Search, Check, X } from "lucide-react";

// Mock database of user-to-business assignments
// In a real app, this would be stored in a database
const businessAssignments = [
  { userId: "user123", businessId: "pillar-to-post", email: "john@example.com" },
];

const AssignBusinessOwners = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [assignments, setAssignments] = useState(businessAssignments);
  
  const handleAssignBusiness = () => {
    if (!userEmail || !selectedBusiness) {
      toast({
        title: "Error",
        description: "Please enter both a user email and select a business",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this email is already assigned to this business
    const existingAssignment = assignments.find(
      a => a.email === userEmail && a.businessId === selectedBusiness
    );
    
    if (existingAssignment) {
      toast({
        title: "Already assigned",
        description: "This user is already assigned to this business",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would save this to a database
    const newAssignment = {
      userId: `user_${Date.now()}`, // Simulating a user ID
      businessId: selectedBusiness,
      email: userEmail
    };
    
    setAssignments([...assignments, newAssignment]);
    
    toast({
      title: "Business assigned",
      description: `${userEmail} has been assigned to manage ${selectedBusiness}`,
    });
    
    // Reset form fields
    setUserEmail("");
    setSelectedBusiness("");
  };
  
  const handleRemoveAssignment = (index: number) => {
    const newAssignments = [...assignments];
    newAssignments.splice(index, 1);
    setAssignments(newAssignments);
    
    toast({
      title: "Assignment removed",
      description: "Business assignment has been removed",
    });
  };
  
  // Filter businesses based on search term
  const filteredBusinesses = searchTerm 
    ? professionalData.professionals.filter(
        business => business.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : professionalData.professionals;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Admin: Assign Business Owners</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assign New Business Owner</CardTitle>
            <CardDescription>Link a user account to a business listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input 
                id="userEmail" 
                placeholder="Enter user email" 
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessSearch">Search Business</Label>
              <div className="flex gap-2">
                <Input 
                  id="businessSearch" 
                  placeholder="Search for a business" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessSelect">Select Business</Label>
              <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {filteredBusinesses.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAssignBusiness} className="w-full">
              Assign Business Owner
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>User-to-business ownership assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="space-y-4">
                {assignments.map((assignment, index) => {
                  const business = professionalData.professionals.find(
                    b => b.id === assignment.businessId
                  );
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{assignment.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {business?.name || "Unknown business"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveAssignment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No assignments found. Assign users to businesses using the form.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignBusinessOwners;
