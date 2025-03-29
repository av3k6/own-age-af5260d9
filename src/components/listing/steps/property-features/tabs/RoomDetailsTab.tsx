
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../../../context/FormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { levelOptions } from "../utils/propertyFeatures";

const RoomDetailsTab = () => {
  const { formData, updateFormData } = useFormContext();
  
  // Room details state
  const [roomName, setRoomName] = useState("");
  const [roomLevel, setRoomLevel] = useState(levelOptions[0]);
  const [roomDimensions, setRoomDimensions] = useState("");
  const [roomType, setRoomType] = useState("bedroom");

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

  return (
    <>
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
    </>
  );
};

export default RoomDetailsTab;
