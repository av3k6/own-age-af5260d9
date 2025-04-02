
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Phone, Mail, MapPin, Save, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BusinessFormField from "./BusinessFormField";
import { BusinessFormData } from "@/hooks/useBusinessProfileForm";

interface BusinessProfileFormProps {
  formData: BusinessFormData;
  isSaving: boolean;
  assignedBusiness: any;
  onInputChange: (field: keyof BusinessFormData, value: string) => void;
  onSaveChanges: () => void;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({
  formData,
  isSaving,
  assignedBusiness,
  onInputChange,
  onSaveChanges
}) => {
  const navigate = useNavigate();
  
  return (
    <>
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
          <BusinessFormField
            id="businessName"
            label="Business Name"
            value={formData.businessName}
            onChange={(value) => onInputChange("businessName", value)}
          />
          
          <BusinessFormField
            id="expertise"
            label="Area of Expertise"
            value={formData.expertise}
            onChange={(value) => onInputChange("expertise", value)}
          />
          
          <BusinessFormField
            id="serviceArea"
            label="Service Area"
            value={formData.serviceArea}
            onChange={(value) => onInputChange("serviceArea", value)}
            placeholder="e.g., Greater Vancouver and Fraser Valley"
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            <BusinessFormField
              id="phone"
              label="Phone"
              value={formData.phone}
              onChange={(value) => onInputChange("phone", value)}
              icon={<Phone className="h-4 w-4" />}
            />
            
            <BusinessFormField
              id="email"
              label="Email"
              value={formData.email}
              onChange={(value) => onInputChange("email", value)}
              icon={<Mail className="h-4 w-4" />}
            />
          </div>
          
          <BusinessFormField
            id="address"
            label="Address"
            value={formData.address}
            onChange={(value) => onInputChange("address", value)}
            type="textarea"
            icon={<MapPin className="h-4 w-4" />}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/professionals/${assignedBusiness.category}/${assignedBusiness.id}`)}
          >
            Cancel
          </Button>
          <Button onClick={onSaveChanges} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default BusinessProfileForm;
