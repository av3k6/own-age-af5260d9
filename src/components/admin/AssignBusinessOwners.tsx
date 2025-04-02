
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { professionalData } from "@/components/professionals/data/professionalData";
import { Search, Check, X, Loader2 } from "lucide-react";

// Mock database of user-to-business assignments
// In a real app, this would be stored in a database
const initialBusinessAssignments = [
  { userId: "user123", businessId: "pillar-to-post", email: "john@example.com" },
  { userId: "testuser", businessId: "pillar-to-post", email: "test@example.com" },
];

const AssignBusinessOwners = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [assignments, setAssignments] = useState(initialBusinessAssignments);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusinessData, setSelectedBusinessData] = useState<any>(null);
  
  // Load assignments from localStorage if available
  useEffect(() => {
    const savedAssignments = localStorage.getItem("businessAssignments");
    if (savedAssignments) {
      try {
        setAssignments(JSON.parse(savedAssignments));
      } catch (e) {
        console.error("Error loading saved assignments:", e);
      }
    }
  }, []);
  
  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusiness(businessId);
    setSelectedBusinessData(null);
    setUserEmail("");
  };
  
  const handleLoadBusinessData = () => {
    if (!selectedBusiness) {
      toast({
        title: "Error",
        description: "Please select a business first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Find the business details
    const business = professionalData.professionals.find(b => b.id === selectedBusiness);
    
    // Find any existing email assignments for this business
    const existingAssignment = assignments.find(a => a.businessId === selectedBusiness);
    
    setTimeout(() => { // Simulate loading
      setIsLoading(false);
      
      if (business) {
        setSelectedBusinessData({
          ...business,
          assignedEmail: existingAssignment?.email || ""
        });
        
        // Pre-fill the email input if there's an existing assignment
        if (existingAssignment) {
          setUserEmail(existingAssignment.email);
        } else {
          // Pre-fill with the business email if available
          setUserEmail(business.email || "");
        }
      }
      
      toast({
        title: "Business data loaded",
        description: business ? `${business.name} data loaded successfully` : "Business not found",
      });
    }, 500);
  };
  
  const handleAssignBusiness = () => {
    if (!selectedBusiness || !userEmail) {
      toast({
        title: "Error",
        description: "Please select a business and enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this business already has an assignment
    const existingAssignmentIndex = assignments.findIndex(
      a => a.businessId === selectedBusiness
    );
    
    let updatedAssignments = [...assignments];
    
    if (existingAssignmentIndex >= 0) {
      // Update the existing assignment
      updatedAssignments[existingAssignmentIndex] = {
        ...updatedAssignments[existingAssignmentIndex],
        email: userEmail
      };
      
      toast({
        title: "Assignment updated",
        description: `Email for ${selectedBusinessData?.name} updated to ${userEmail}`,
      });
    } else {
      // Create a new assignment
      const newAssignment = {
        userId: `user_${Date.now()}`,
        businessId: selectedBusiness,
        email: userEmail
      };
      
      updatedAssignments = [...assignments, newAssignment];
      
      toast({
        title: "Business assigned",
        description: `${userEmail} has been assigned to manage ${selectedBusinessData?.name}`,
      });
    }
    
    // Update state and localStorage
    setAssignments(updatedAssignments);
    localStorage.setItem("businessAssignments", JSON.stringify(updatedAssignments));
    
    // Reset form fields
    setSelectedBusiness("");
    setUserEmail("");
    setSelectedBusinessData(null);
  };
  
  const handleRemoveAssignment = (index: number) => {
    const newAssignments = [...assignments];
    const removed = newAssignments.splice(index, 1)[0];
    setAssignments(newAssignments);
    
    // Update localStorage
    localStorage.setItem("businessAssignments", JSON.stringify(newAssignments));
    
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
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Business Owner Assignments</h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manage Business Ownership</CardTitle>
            <CardDescription>Select, load, and update business owner emails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Select value={selectedBusiness} onValueChange={handleSelectBusiness}>
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
            
            <div className="flex justify-end">
              <Button 
                onClick={handleLoadBusinessData} 
                disabled={!selectedBusiness || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : "Load Business Data"}
              </Button>
            </div>
            
            {selectedBusinessData && (
              <div className="mt-6 space-y-4 p-4 border rounded-md bg-muted/50">
                <div>
                  <h3 className="font-medium text-lg">{selectedBusinessData.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedBusinessData.expertise}</p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="businessEmail">Business Email</Label>
                  <Input 
                    id="businessEmail"
                    value={selectedBusinessData.email || "No email available"}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="currentAssignedEmail">
                    Current Assigned Owner Email
                  </Label>
                  <Input 
                    id="currentAssignedEmail"
                    value={selectedBusinessData.assignedEmail || "No owner assigned yet"}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="newOwnerEmail">
                    {selectedBusinessData.assignedEmail ? "Update Owner Email" : "Assign Owner Email"}
                  </Label>
                  <Input 
                    id="newOwnerEmail"
                    placeholder="Enter user email" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleAssignBusiness} 
              className="w-full"
              disabled={!selectedBusinessData || !userEmail}
            >
              {selectedBusinessData?.assignedEmail ? "Update Business Owner" : "Assign Business Owner"}
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
