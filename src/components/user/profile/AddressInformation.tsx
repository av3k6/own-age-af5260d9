
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "@/types/profile";
import { useAddressManagement } from "@/hooks/profile/useAddressManagement";

interface AddressInformationProps {
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
}

const AddressInformation = ({
  profileData,
  setProfileData,
  isEditing
}: AddressInformationProps) => {
  const { address, updateAddress } = useAddressManagement(profileData, setProfileData);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="street">Street Address</Label>
          <Input 
            id="street" 
            value={address.street} 
            onChange={(e) => updateAddress('street', e.target.value)} 
            disabled={!isEditing}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              value={address.city} 
              onChange={(e) => updateAddress('city', e.target.value)} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="province">Province</Label>
            <Input 
              id="province" 
              value={address.province} 
              onChange={(e) => updateAddress('province', e.target.value)} 
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input 
              id="postalCode" 
              value={address.postalCode} 
              onChange={(e) => updateAddress('postalCode', e.target.value)} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              value={address.country} 
              onChange={(e) => updateAddress('country', e.target.value)} 
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
