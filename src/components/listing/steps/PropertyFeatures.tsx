
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bed, Bath, AreaChart, Calendar, Home, Warehouse, TreePine, Building2 } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const commonFeatures = [
  { id: "garage", label: "Garage" },
  { id: "basement", label: "Basement" },
  { id: "pool", label: "Swimming Pool" },
  { id: "fireplace", label: "Fireplace" },
  { id: "garden", label: "Garden" },
  { id: "airConditioning", label: "Air Conditioning" },
  { id: "heating", label: "Central Heating" },
  { id: "balcony", label: "Balcony" },
  { id: "securitySystem", label: "Security System" },
  { id: "parkingSpot", label: "Parking Spot" },
  { id: "furnished", label: "Furnished" },
  { id: "petFriendly", label: "Pet Friendly" },
  { id: "storageSpace", label: "Storage Space" },
  { id: "elevator", label: "Elevator" },
  { id: "wheelchair", label: "Wheelchair Accessible" }
];

const levelOptions = ["Main", "Second", "Basement", "Third", "Attic", "Lower"];

const PropertyFeatures = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const [customFeature, setCustomFeature] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  // Room details state
  const [roomName, setRoomName] = useState("");
  const [roomLevel, setRoomLevel] = useState(levelOptions[0]);
  const [roomDimensions, setRoomDimensions] = useState("");
  const [roomType, setRoomType] = useState("bedroom");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  const toggleFeature = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    updateFormData({ features: updatedFeatures });
  };

  const addCustomFeature = () => {
    if (customFeature.trim() !== "" && !formData.features.includes(customFeature)) {
      updateFormData({ features: [...formData.features, customFeature] });
      setCustomFeature("");
    }
  };

  const addRoom = () => {
    if (roomName.trim() === "") return;
    
    const newRoom = {
      name: roomName,
      level: roomLevel,
      dimensions: roomDimensions.trim() || undefined
    };
    
    if (roomType === "bedroom") {
      const currentBedrooms = formData.roomDetails?.bedrooms || [];
      updateFormData({ 
        roomDetails: { 
          ...formData.roomDetails, 
          bedrooms: [...currentBedrooms, newRoom] 
        } 
      });
    } else {
      const currentOtherRooms = formData.roomDetails?.otherRooms || [];
      updateFormData({ 
        roomDetails: { 
          ...formData.roomDetails, 
          otherRooms: [...currentOtherRooms, newRoom] 
        } 
      });
    }
    
    // Reset form
    setRoomName("");
    setRoomDimensions("");
  };

  const removeRoom = (index: number, type: "bedroom" | "otherRoom") => {
    if (type === "bedroom") {
      const updatedBedrooms = [...(formData.roomDetails?.bedrooms || [])];
      updatedBedrooms.splice(index, 1);
      updateFormData({
        roomDetails: {
          ...formData.roomDetails,
          bedrooms: updatedBedrooms
        }
      });
    } else {
      const updatedOtherRooms = [...(formData.roomDetails?.otherRooms || [])];
      updatedOtherRooms.splice(index, 1);
      updateFormData({
        roomDetails: {
          ...formData.roomDetails,
          otherRooms: updatedOtherRooms
        }
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.bedrooms > 0 &&
      formData.bathrooms > 0 &&
      formData.squareFeet > 0 &&
      formData.yearBuilt > 0
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="rooms">Room Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="bedrooms" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" /> Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData({ bedrooms: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bathrooms" className="flex items-center gap-2">
                  <Bath className="h-4 w-4" /> Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData({ bathrooms: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="squareFeet" className="flex items-center gap-2">
                  <AreaChart className="h-4 w-4" /> Square Feet
                </Label>
                <Input
                  id="squareFeet"
                  type="number"
                  min="0"
                  value={formData.squareFeet || ""}
                  onChange={(e) => updateFormData({ squareFeet: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="yearBuilt" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Year Built
                </Label>
                <Input
                  id="yearBuilt"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.yearBuilt || ""}
                  onChange={(e) => updateFormData({ yearBuilt: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="lotSize" className="flex items-center gap-2">
                  <TreePine className="h-4 w-4" /> Lot Size
                </Label>
                <Input
                  id="lotSize"
                  placeholder="e.g. 70 x 180 feet"
                  value={formData.roomDetails?.lotSize || ""}
                  onChange={(e) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      lotSize: e.target.value 
                    } 
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="parkingSpaces" className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4" /> Parking Spaces
                </Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  min="0"
                  value={formData.roomDetails?.totalParkingSpaces || ""}
                  onChange={(e) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      totalParkingSpaces: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="stories" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Stories/Levels
                </Label>
                <Input
                  id="stories"
                  type="number"
                  min="1"
                  value={formData.roomDetails?.stories || ""}
                  onChange={(e) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      stories: Number(e.target.value) 
                    } 
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="basement" className="flex items-center gap-2">
                  <Home className="h-4 w-4" /> Basement Type
                </Label>
                <Select
                  value={formData.roomDetails?.basement || ""}
                  onValueChange={(value) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      basement: value 
                    } 
                  })}
                >
                  <SelectTrigger id="basement">
                    <SelectValue placeholder="Select basement type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finished">Finished</SelectItem>
                    <SelectItem value="Unfinished">Unfinished</SelectItem>
                    <SelectItem value="Partially Finished">Partially Finished</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="space-y-4">
            <Label>Property Features</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {commonFeatures.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={feature.id}
                    checked={formData.features.includes(feature.label)}
                    onCheckedChange={() => toggleFeature(feature.label)}
                  />
                  <Label htmlFor={feature.id} className="cursor-pointer">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customFeature">Add Custom Feature</Label>
            <div className="flex gap-2">
              <Input
                id="customFeature"
                value={customFeature}
                onChange={(e) => setCustomFeature(e.target.value)}
                placeholder="e.g. Rooftop Terrace"
              />
              <Button 
                type="button" 
                onClick={addCustomFeature}
                disabled={customFeature.trim() === ""}
              >
                Add
              </Button>
            </div>
          </div>

          {formData.features.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Features</Label>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Additional Property Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heating">Heating System</Label>
                <Input
                  id="heating"
                  placeholder="e.g. Forced Air"
                  value={formData.roomDetails?.heating || ""}
                  onChange={(e) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      heating: e.target.value 
                    } 
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="cooling">Cooling System</Label>
                <Input
                  id="cooling"
                  placeholder="e.g. Central Air"
                  value={formData.roomDetails?.cooling || ""}
                  onChange={(e) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      cooling: e.target.value 
                    } 
                  })}
                />
              </div>
              
              <div>
                <Label htmlFor="construction">Construction Material</Label>
                <Select
                  value={formData.roomDetails?.construction || ""}
                  onValueChange={(value) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      construction: value 
                    } 
                  })}
                >
                  <SelectTrigger id="construction">
                    <SelectValue placeholder="Select construction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brick">Brick</SelectItem>
                    <SelectItem value="Wood">Wood</SelectItem>
                    <SelectItem value="Stucco">Stucco</SelectItem>
                    <SelectItem value="Concrete">Concrete</SelectItem>
                    <SelectItem value="Stone">Stone</SelectItem>
                    <SelectItem value="Vinyl">Vinyl</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="heatingFuel">Heating Fuel</Label>
                <Select
                  value={formData.roomDetails?.heatingFuel || ""}
                  onValueChange={(value) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      heatingFuel: value 
                    } 
                  })}
                >
                  <SelectTrigger id="heatingFuel">
                    <SelectValue placeholder="Select heating fuel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gas">Gas</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Oil">Oil</SelectItem>
                    <SelectItem value="Propane">Propane</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="centralVac"
                  checked={formData.roomDetails?.centralVac || false}
                  onCheckedChange={(checked) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      centralVac: !!checked 
                    } 
                  })}
                />
                <Label htmlFor="centralVac" className="cursor-pointer">
                  Has Central Vacuum
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fireplace"
                  checked={formData.roomDetails?.fireplace || false}
                  onCheckedChange={(checked) => updateFormData({ 
                    roomDetails: { 
                      ...formData.roomDetails, 
                      fireplace: !!checked 
                    } 
                  })}
                />
                <Label htmlFor="fireplace" className="cursor-pointer">
                  Has Fireplace
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rooms" className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Add Room Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select
                  value={roomType}
                  onValueChange={setRoomType}
                >
                  <SelectTrigger id="roomType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="other">Other Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="roomName">Room Name</Label>
                <Input
                  id="roomName"
                  placeholder="e.g. Primary Bedroom"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="roomLevel">Room Level</Label>
                <Select
                  value={roomLevel}
                  onValueChange={setRoomLevel}
                >
                  <SelectTrigger id="roomLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="roomDimensions">Dimensions</Label>
                <Input
                  id="roomDimensions"
                  placeholder="e.g. 12 x 14"
                  value={roomDimensions}
                  onChange={(e) => setRoomDimensions(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Button type="button" onClick={addRoom} disabled={!roomName}>
                Add Room
              </Button>
            </div>
          </div>
          
          {(formData.roomDetails?.bedrooms?.length || 0) > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Bedrooms</h4>
              <div className="space-y-2">
                {formData.roomDetails?.bedrooms?.map((room, index) => (
                  <div key={`bedroom-${index}`} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-muted-foreground">Level: {room.level}{room.dimensions ? `, Dimensions: ${room.dimensions}` : ''}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeRoom(index, "bedroom")}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(formData.roomDetails?.otherRooms?.length || 0) > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Other Rooms</h4>
              <div className="space-y-2">
                {formData.roomDetails?.otherRooms?.map((room, index) => (
                  <div key={`otherRoom-${index}`} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-muted-foreground">Level: {room.level}{room.dimensions ? `, Dimensions: ${room.dimensions}` : ''}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeRoom(index, "otherRoom")}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button type="submit" disabled={!isFormValid()}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default PropertyFeatures;
