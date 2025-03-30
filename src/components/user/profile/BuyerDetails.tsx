import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Home, MapPin } from "lucide-react";
import { UserProfileData } from "@/types/profile";

interface BuyerDetailsProps {
  profileData: UserProfileData;
  setProfileData: (data: UserProfileData) => void;
  isEditing: boolean;
  newLocation: string;
  setNewLocation: (value: string) => void;
  newPropertyType: string;
  setNewPropertyType: (value: string) => void;
  addPreferredLocation: () => void;
  removePreferredLocation: (location: string) => void;
  addPropertyTypePreference: () => void;
  removePropertyTypePreference: (type: string) => void;
}

const BuyerDetails = ({
  profileData,
  setProfileData,
  isEditing,
  newLocation,
  setNewLocation,
  newPropertyType,
  setNewPropertyType,
  addPreferredLocation,
  removePreferredLocation,
  addPropertyTypePreference,
  removePropertyTypePreference
}: BuyerDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="budgetRange">Budget Range</Label>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="budgetMin" 
              type="number"
              className="pl-9"
              value={profileData.budgetMin} 
              onChange={(e) => setProfileData({...profileData, budgetMin: parseInt(e.target.value) || 0})} 
              disabled={!isEditing}
            />
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="relative flex-1">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              id="budgetMax" 
              type="number"
              className="pl-9"
              value={profileData.budgetMax} 
              onChange={(e) => setProfileData({...profileData, budgetMax: parseInt(e.target.value) || 0})} 
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label>Preferred Locations</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Add a location"
              className="pl-9"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <Button 
            type="button" 
            onClick={addPreferredLocation}
            disabled={!isEditing || !newLocation}
            size="sm"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {profileData.preferredLocations.map((location, index) => (
            <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2">
              <span>{location}</span>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => removePreferredLocation(location)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label>Property Type Preferences</Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Add a property type"
              className="pl-9"
              value={newPropertyType}
              onChange={(e) => setNewPropertyType(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <Button 
            type="button" 
            onClick={addPropertyTypePreference}
            disabled={!isEditing || !newPropertyType}
            size="sm"
          >
            Add
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {profileData.propertyTypePreferences.map((type, index) => (
            <div key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2">
              <span>{type}</span>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={() => removePropertyTypePreference(type)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerDetails;
