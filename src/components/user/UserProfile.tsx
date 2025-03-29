
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Home } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import BasicInfoTab from "./profile/BasicInfoTab";
import RoleSpecificTab from "./profile/RoleSpecificTab";
import PreferencesTab from "./profile/PreferencesTab";
import ProfileActions from "./profile/ProfileActions";

const UserProfile = () => {
  const { user } = useAuth();
  
  const {
    profileData,
    setProfileData,
    isEditing,
    setIsEditing,
    isLoading,
    newLocation,
    setNewLocation,
    newPropertyType,
    setNewPropertyType,
    addPreferredLocation,
    removePreferredLocation,
    addPropertyTypePreference,
    removePropertyTypePreference,
    handleSaveProfile
  } = useUserProfile(user);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">User Profile</CardTitle>
        <CardDescription>
          Manage your account information and preferences
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="role-specific">Role Details</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <CardContent>
            <BasicInfoTab
              user={user}
              profileData={profileData}
              setProfileData={setProfileData}
              isEditing={isEditing}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="role-specific">
          <CardContent>
            <RoleSpecificTab
              profileData={profileData}
              setProfileData={setProfileData}
              isEditing={isEditing}
              newLocation={newLocation}
              setNewLocation={setNewLocation}
              newPropertyType={newPropertyType}
              setNewPropertyType={setNewPropertyType}
              addPreferredLocation={addPreferredLocation}
              removePreferredLocation={removePreferredLocation}
              addPropertyTypePreference={addPropertyTypePreference}
              removePropertyTypePreference={removePropertyTypePreference}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="preferences">
          <CardContent>
            <PreferencesTab
              profileData={profileData}
              setProfileData={setProfileData}
              isEditing={isEditing}
            />
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter>
        <ProfileActions
          isEditing={isEditing}
          isLoading={isLoading}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onSave={handleSaveProfile}
        />
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
