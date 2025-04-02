
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { professionalData } from "./data/professionalData";
import { Building2, Phone, Mail, MapPin, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditBusinessProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [assignedBusiness, setAssignedBusiness] = useState<any | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [expertise, setExpertise] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [businessId, setBusinessId] = useState("");
  
  // Find if the current user is assigned to any business
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    // Load from localStorage
    try {
      const savedAssignments = localStorage.getItem("businessAssignments");
      const businessAssignments = savedAssignments ? JSON.parse(savedAssignments) : [];
      
      const userAssignment = businessAssignments.find(
        (assignment: any) => assignment.email === user.email
      );
      
      if (userAssignment) {
        const business = professionalData.professionals.find(
          pro => pro.id === userAssignment.businessId
        );
        
        if (business) {
          setAssignedBusiness(business);
          setBusinessName(business.name);
          setExpertise(business.expertise);
          setPhone(business.phone);
          setEmail(business.email);
          setAddress(business.address);
          setServiceArea(business.serviceArea || "");
          setBusinessId(business.id);
        }
      }
    } catch (e) {
      console.error("Error loading business assignments:", e);
    }
    
    setIsLoading(false);
  }, [user]);

  // Handle form submission
  const handleSaveChanges = () => {
    setIsLoading(true);
    
    // In a real app, this would send the data to the backend to update the business
    // For now, we'll update our local storage to simulate persistence
    try {
      // Create a copy of the updated business data
      const updatedBusiness = {
        ...assignedBusiness,
        name: businessName,
        expertise: expertise,
        phone: phone,
        email: email,
        address: address,
        serviceArea: serviceArea
      };
      
      // Find and update the business in the local copy of professionals data
      const localBusinessData = localStorage.getItem("localBusinessData");
      let businessData = localBusinessData ? JSON.parse(localBusinessData) : [...professionalData.professionals];
      
      // Find the index of the business to update
      const businessIndex = businessData.findIndex((b: any) => b.id === businessId);
      
      // Update the business if found, otherwise add it
      if (businessIndex !== -1) {
        businessData[businessIndex] = updatedBusiness;
      } else {
        businessData.push(updatedBusiness);
      }
      
      // Save back to localStorage
      localStorage.setItem("localBusinessData", JSON.stringify(businessData));
      
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Changes saved",
          description: "Your business profile has been updated successfully",
        });
        
        // Redirect back to the professional detail page
        if (assignedBusiness) {
          navigate(`/professionals/${assignedBusiness.category}/${assignedBusiness.id}`);
        }
      }, 800);
    } catch (error) {
      console.error("Error saving business data:", error);
      setIsLoading(false);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your business profile",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Loading...</h1>
      </div>
    );
  }

  if (!assignedBusiness) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>No Business Assigned</CardTitle>
            <CardDescription>
              You haven't been assigned as the owner/operator of any business listings yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please contact an administrator to be assigned to your business listing.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Your Business Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Business Details
          </CardTitle>
          <CardDescription>
            Update your business information displayed in our professional directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expertise">Area of Expertise</Label>
            <Input
              id="expertise"
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g., Greater Vancouver and Fraser Valley"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> Phone
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> Address
            </Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/professionals/${assignedBusiness.category}/${assignedBusiness.id}`)}
          >
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
            {!isLoading && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditBusinessProfile;
