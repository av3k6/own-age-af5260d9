
import BuyerDetails from "./BuyerDetails";
import ProfessionalDetails from "./ProfessionalDetails";
import { UserProfileData } from "@/types/profile";

interface RoleSpecificTabProps {
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
}

const RoleSpecificTab = ({
  profileData,
  setProfileData,
  isEditing
}: RoleSpecificTabProps) => {
  return (
    <div className="pt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {profileData.role === "buyer" ? "Buyer Details" : 
           profileData.role === "seller" ? "Seller Details" :
           profileData.role === "professional" ? "Professional Details" : 
           "Account Details"}
        </h3>
        
        {profileData.role === "buyer" && (
          <BuyerDetails 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
          />
        )}
        
        {profileData.role === "professional" && (
          <ProfessionalDetails 
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
          />
        )}
        
        {profileData.role === "seller" && (
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <p className="text-center text-muted-foreground">
                Additional seller details will be available soon. For now, you can list properties through the "Sell" section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSpecificTab;
