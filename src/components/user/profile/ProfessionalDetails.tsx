import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { UserProfileData } from "@/types/profile";

interface ProfessionalDetailsProps {
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
}

const ProfessionalDetails = ({
  profileData,
  setProfileData,
  isEditing
}: ProfessionalDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="serviceType">Service Type</Label>
        <Select
          disabled={!isEditing}
          value={profileData.serviceType}
          onValueChange={(value) => setProfileData({...profileData, serviceType: value})}
        >
          <SelectTrigger id="serviceType">
            <SelectValue placeholder="Select your service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inspector">Inspector</SelectItem>
            <SelectItem value="contractor">Contractor</SelectItem>
            <SelectItem value="lawyer">Lawyer</SelectItem>
            <SelectItem value="appraiser">Appraiser</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="companyName" 
            className="pl-9"
            value={profileData.companyName} 
            onChange={(e) => setProfileData({...profileData, companyName: e.target.value})} 
            disabled={!isEditing}
          />
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input 
          id="licenseNumber" 
          value={profileData.licenseNumber} 
          onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})} 
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default ProfessionalDetails;
