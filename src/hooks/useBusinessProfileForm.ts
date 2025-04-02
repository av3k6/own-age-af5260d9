import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { professionalData } from "@/components/professionals/data";

export interface BusinessFormData {
  businessName: string;
  expertise: string;
  phone: string;
  email: string;
  address: string;
  serviceArea: string;
  businessId: string;
}

export const useBusinessProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [assignedBusiness, setAssignedBusiness] = useState<any | null>(null);
  
  const [formData, setFormData] = useState<BusinessFormData>({
    businessName: "",
    expertise: "",
    phone: "",
    email: "",
    address: "",
    serviceArea: "",
    businessId: "",
  });
  
  useEffect(() => {
    console.log("useBusinessProfileForm: User check:", user?.email);
    
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        toast({
          title: "Loading timeout",
          description: "Could not verify business ownership. Please try again later.",
          variant: "destructive",
        });
      }
    }, 5000);
    
    try {
      const savedAssignments = localStorage.getItem("businessAssignments");
      const businessAssignments = savedAssignments ? JSON.parse(savedAssignments) : [];
      
      if (user && user.email) {
        console.log("Checking business assignments for:", user.email);
        
        const userAssignment = businessAssignments.find(
          (assignment: any) => assignment.email === user.email
        );
        
        if (userAssignment) {
          console.log("Found business assignment:", userAssignment);
          const localBusinessData = localStorage.getItem("localBusinessData");
          let businessData = localBusinessData ? JSON.parse(localBusinessData) : [...professionalData.professionals];
          
          const business = businessData.find(
            (pro: any) => pro.id === userAssignment.businessId
          );
          
          if (business) {
            console.log("Found business data:", business);
            setAssignedBusiness(business);
            setFormData({
              businessName: business.name || "",
              expertise: business.expertise || "",
              phone: business.phone || "",
              email: business.email || "",
              address: business.address || "",
              serviceArea: business.serviceArea || "",
              businessId: business.id,
            });
          }
        } else {
          console.log("No business assignment found for user");
        }
      } else {
        console.log("User not available yet");
      }
    } catch (e) {
      console.error("Error loading business assignments:", e);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      clearTimeout(timeoutId);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [user, toast]);

  const handleInputChange = (field: keyof BusinessFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    try {
      const updatedBusiness = {
        ...assignedBusiness,
        name: formData.businessName,
        expertise: formData.expertise,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        serviceArea: formData.serviceArea
      };
      
      const localBusinessData = localStorage.getItem("localBusinessData");
      let businessData = localBusinessData ? JSON.parse(localBusinessData) : [...professionalData.professionals];
      
      const businessIndex = businessData.findIndex((b: any) => b.id === formData.businessId);
      
      if (businessIndex !== -1) {
        businessData[businessIndex] = updatedBusiness;
      } else {
        businessData.push(updatedBusiness);
      }
      
      localStorage.setItem("localBusinessData", JSON.stringify(businessData));
      
      setTimeout(() => {
        setIsSaving(false);
        toast({
          title: "Changes saved",
          description: "Your business profile has been updated successfully",
        });
        
        if (assignedBusiness) {
          navigate(`/professionals/${assignedBusiness.category}/${assignedBusiness.id}`);
        }
      }, 800);
    } catch (error) {
      console.error("Error saving business data:", error);
      setIsSaving(false);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your business profile",
        variant: "destructive",
      });
    }
  };

  return { 
    formData,
    isLoading,
    isSaving,
    assignedBusiness,
    handleInputChange,
    handleSaveChanges,
  };
};
