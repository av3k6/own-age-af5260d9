import { User } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileHeader } from "./ProfileHeader";
import { UserProfileData } from "@/types/profile";

interface BasicInfoTabProps {
  user: User | null;
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
}

const BasicInfoTab = ({ user, profileData, setProfileData, isEditing }: BasicInfoTabProps) => {
  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <ProfileHeader user={user} fullName={profileData.fullName} />
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium">Account Information</h3>
            <p className="text-sm text-muted-foreground">
              Your personal information and account details
            </p>
          </div>
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user?.email || ""} 
                disabled 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={profileData.fullName} 
                onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} 
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={profileData.phone} 
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})} 
                disabled={!isEditing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select
                disabled={!isEditing}
                value={profileData.role}
                onValueChange={(value) => setProfileData({...profileData, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="professional">Real Estate Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={profileData.bio} 
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})} 
                disabled={!isEditing}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;
