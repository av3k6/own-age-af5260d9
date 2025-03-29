
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, User as UserIcon, Home, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserProfile = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    phone: user?.user_metadata?.phone || "",
    bio: user?.user_metadata?.bio || "",
    role: user?.user_metadata?.role || "buyer",
    address: {
      street: user?.user_metadata?.address?.street || "",
      city: user?.user_metadata?.address?.city || "",
      province: user?.user_metadata?.address?.province || "",
      postalCode: user?.user_metadata?.address?.postalCode || "",
      country: user?.user_metadata?.address?.country || "Canada",
    },
    // Buyer specific fields
    preferredLocations: user?.user_metadata?.preferredLocations || [],
    budgetMin: user?.user_metadata?.budgetRange?.min || 0,
    budgetMax: user?.user_metadata?.budgetRange?.max || 1000000,
    propertyTypePreferences: user?.user_metadata?.propertyTypePreferences || [],
    // Professional specific fields
    serviceType: user?.user_metadata?.serviceType || "",
    companyName: user?.user_metadata?.companyName || "",
    licenseNumber: user?.user_metadata?.licenseNumber || "",
  });

  const [newLocation, setNewLocation] = useState("");
  const [newPropertyType, setNewPropertyType] = useState("");

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : "U";

  const addPreferredLocation = () => {
    if (newLocation && !profileData.preferredLocations.includes(newLocation)) {
      setProfileData({
        ...profileData,
        preferredLocations: [...profileData.preferredLocations, newLocation]
      });
      setNewLocation("");
    }
  };

  const removePreferredLocation = (location: string) => {
    setProfileData({
      ...profileData,
      preferredLocations: profileData.preferredLocations.filter(loc => loc !== location)
    });
  };

  const addPropertyTypePreference = () => {
    if (newPropertyType && !profileData.propertyTypePreferences.includes(newPropertyType)) {
      setProfileData({
        ...profileData,
        propertyTypePreferences: [...profileData.propertyTypePreferences, newPropertyType]
      });
      setNewPropertyType("");
    }
  };

  const removePropertyTypePreference = (type: string) => {
    setProfileData({
      ...profileData,
      propertyTypePreferences: profileData.propertyTypePreferences.filter(t => t !== type)
    });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: profileData.fullName,
          phone: profileData.phone,
          bio: profileData.bio,
          role: profileData.role,
          address: profileData.address,
          preferredLocations: profileData.preferredLocations,
          budgetRange: {
            min: profileData.budgetMin,
            max: profileData.budgetMax
          },
          propertyTypePreferences: profileData.propertyTypePreferences,
          serviceType: profileData.serviceType,
          companyName: profileData.companyName,
          licenseNumber: profileData.licenseNumber
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardContent className="space-y-6 pt-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={profileData.fullName || user?.email} />
                <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
              </Avatar>
              
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
          </CardContent>
        </TabsContent>
        
        <TabsContent value="role-specific">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {profileData.role === "buyer" ? "Buyer Details" : 
                 profileData.role === "seller" ? "Seller Details" :
                 profileData.role === "professional" ? "Professional Details" : 
                 "Account Details"}
              </h3>
              
              {profileData.role === "buyer" && (
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
              )}
              
              {profileData.role === "professional" && (
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
          </CardContent>
        </TabsContent>
        
        <TabsContent value="preferences">
          <CardContent className="pt-6">
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
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProfile}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            Edit Profile
            <Edit className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
