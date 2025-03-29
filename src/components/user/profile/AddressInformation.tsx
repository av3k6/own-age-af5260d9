
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "@/hooks/useUserProfile";

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
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="street">Street Address</Label>
          <Input 
            id="street" 
            value={profileData.address.street} 
            onChange={(e) => setProfileData({
              ...profileData, 
              address: {...profileData.address, street: e.target.value}
            })} 
            disabled={!isEditing}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              value={profileData.address.city} 
              onChange={(e) => setProfileData({
                ...profileData, 
                address: {...profileData.address, city: e.target.value}
              })} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="province">Province</Label>
            <Input 
              id="province" 
              value={profileData.address.province} 
              onChange={(e) => setProfileData({
                ...profileData, 
                address: {...profileData.address, province: e.target.value}
              })} 
              disabled={!isEditing}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input 
              id="postalCode" 
              value={profileData.address.postalCode} 
              onChange={(e) => setProfileData({
                ...profileData, 
                address: {...profileData.address, postalCode: e.target.value}
              })} 
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              value={profileData.address.country} 
              onChange={(e) => setProfileData({
                ...profileData, 
                address: {...profileData.address, country: e.target.value}
              })} 
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
