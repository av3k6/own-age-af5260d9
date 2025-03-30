import AddressInformation from "./AddressInformation";
import { UserProfileData } from "@/types/profile";

interface PreferencesTabProps {
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
}

const PreferencesTab = ({
  profileData,
  setProfileData,
  isEditing
}: PreferencesTabProps) => {
  return (
    <div className="pt-6">
      <div className="space-y-4">
        <AddressInformation 
          profileData={profileData}
          setProfileData={setProfileData}
          isEditing={isEditing}
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure how you'd like to receive updates and notifications
          </p>
          
          <div className="p-4 border rounded-md bg-muted/50">
            <p className="text-center text-muted-foreground">
              Notification preferences will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;
