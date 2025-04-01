
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Room } from "@/types";
import { levelOptions } from "@/components/listing/steps/property-features/utils/propertyFeatures";
import { useToast } from "@/hooks/use-toast";

interface RoomDetailsTabProps {
  bedroomRooms: Room[];
  setBedroomRooms: (rooms: Room[]) => void;
  otherRooms: Room[];
  setOtherRooms: (rooms: Room[]) => void;
  bedroomCount: number;
}

const RoomDetailsTab = ({ 
  bedroomRooms, 
  setBedroomRooms, 
  otherRooms, 
  setOtherRooms,
  bedroomCount
}: RoomDetailsTabProps) => {
  const { toast } = useToast();
  
  // Room details state
  const [roomName, setRoomName] = useState("");
  const [roomLevel, setRoomLevel] = useState(levelOptions[0]);
  const [roomDimensions, setRoomDimensions] = useState("");
  const [roomType, setRoomType] = useState("bedroom");

  const addRoom = () => {
    if (!roomName.trim()) return;
    
    const newRoom: Room = {
      name: roomName,
      level: roomLevel,
      dimensions: roomDimensions.trim() || undefined
    };
    
    if (roomType === "bedroom") {
      if (bedroomRooms.length >= bedroomCount) {
        toast({
          title: "Cannot Add More Bedrooms",
          description: `You've specified ${bedroomCount} bedrooms in total. Increase the bedroom count to add more room details.`,
          variant: "destructive",
        });
        return;
      }
      setBedroomRooms([...bedroomRooms, newRoom]);
    } else {
      setOtherRooms([...otherRooms, newRoom]);
    }
    
    setRoomName("");
    setRoomDimensions("");
  };

  const removeRoom = (index: number, type: "bedroom" | "otherRoom") => {
    if (type === "bedroom") {
      const updated = [...bedroomRooms];
      updated.splice(index, 1);
      setBedroomRooms(updated);
    } else {
      const updated = [...otherRooms];
      updated.splice(index, 1);
      setOtherRooms(updated);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted/40 rounded-md">
        <div className="mb-4">
          <p className="text-sm mb-2">
            You have specified <strong>{bedroomCount}</strong> bedrooms for this property. 
            Add details for each bedroom below.
          </p>
          <p className="text-xs text-muted-foreground">
            {bedroomRooms.length} of {bedroomCount} bedrooms have details added.
          </p>
        </div>
        
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
        
        <div className="mt-4">
          <Button type="button" onClick={addRoom} disabled={!roomName}>
            Add Room
          </Button>
        </div>
      </div>
      
      {bedroomRooms.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Bedrooms</h4>
          <div className="space-y-2">
            {bedroomRooms.map((room, index) => (
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
      
      {otherRooms.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Other Rooms</h4>
          <div className="space-y-2">
            {otherRooms.map((room, index) => (
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
    </div>
  );
};

export default RoomDetailsTab;
