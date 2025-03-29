
import React, { useState } from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RoomList from "./rooms/RoomList";
import AddRoomForm from "./rooms/AddRoomForm";
import MeasurementUnitSelector from "./rooms/MeasurementUnitSelector";

interface RoomsTabProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
  measurementUnit: string;
  setMeasurementUnit: (unit: string) => void;
  canEdit?: boolean;
  onRoomChange?: (bedrooms: Room[], otherRooms: Room[]) => void;
}

const RoomsTab = ({
  bedrooms = [],
  otherRooms = [],
  propertyDetails,
  propertyTitle,
  propertyPrice,
  measurementUnit,
  setMeasurementUnit,
  canEdit = false,
  onRoomChange,
}: RoomsTabProps) => {
  const { toast } = useToast();
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  
  // Handle room edit
  const handleRoomEdit = (index: number, type: 'bedroom' | 'otherRoom', editedRoom: Room) => {
    if (!onRoomChange) return;
    
    let updatedBedrooms = [...bedrooms];
    let updatedOtherRooms = [...otherRooms];
    
    if (type === 'bedroom') {
      updatedBedrooms[index] = editedRoom;
    } else {
      updatedOtherRooms[index] = editedRoom;
    }
    
    onRoomChange(updatedBedrooms, updatedOtherRooms);
    toast({
      title: "Room updated",
      description: "Room details have been updated successfully.",
    });
  };
  
  // Delete a room
  const handleRoomDelete = (index: number, type: 'bedroom' | 'otherRoom') => {
    if (!onRoomChange) return;
    
    let updatedBedrooms = [...bedrooms];
    let updatedOtherRooms = [...otherRooms];
    
    if (type === 'bedroom') {
      updatedBedrooms = updatedBedrooms.filter((_, i) => i !== index);
    } else {
      updatedOtherRooms = updatedOtherRooms.filter((_, i) => i !== index);
    }
    
    onRoomChange(updatedBedrooms, updatedOtherRooms);
    toast({
      title: "Room deleted",
      description: "Room has been removed successfully.",
    });
  };
  
  // Add a new room
  const handleRoomAdd = (newRoom: Room, type: 'bedroom' | 'otherRoom') => {
    if (!newRoom.name.trim() || !onRoomChange) {
      toast({
        title: "Invalid room",
        description: "Please provide a room name.",
        variant: "destructive"
      });
      return;
    }
    
    let updatedBedrooms = [...bedrooms];
    let updatedOtherRooms = [...otherRooms];
    
    if (type === 'bedroom') {
      updatedBedrooms.push({ ...newRoom });
    } else {
      updatedOtherRooms.push({ ...newRoom });
    }
    
    onRoomChange(updatedBedrooms, updatedOtherRooms);
    setIsAddingRoom(false);
    toast({
      title: "Room added",
      description: `New ${type === 'bedroom' ? 'bedroom' : 'room'} has been added successfully.`,
    });
  };

  if (!bedrooms.length && !otherRooms.length && !isAddingRoom && !canEdit) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No room details available for this property
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {propertyTitle && propertyPrice && (
        <p className="text-muted-foreground">
          Room details for {propertyTitle}. 
          {propertyDetails?.listedOn && ` Listed for $${propertyPrice.toLocaleString()} on ${formatDate(propertyDetails.listedOn)}`}
        </p>
      )}
      
      <div className="flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          {canEdit && !isAddingRoom && (
            <Button onClick={() => setIsAddingRoom(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Room
            </Button>
          )}
        </div>
        <MeasurementUnitSelector 
          measurementUnit={measurementUnit} 
          setMeasurementUnit={setMeasurementUnit} 
        />
      </div>
      
      {isAddingRoom && (
        <AddRoomForm
          measurementUnit={measurementUnit}
          onRoomAdd={handleRoomAdd}
          onCancel={() => setIsAddingRoom(false)}
        />
      )}
      
      {bedrooms.length > 0 && (
        <RoomList
          title="Bedrooms"
          rooms={bedrooms}
          type="bedroom"
          measurementUnit={measurementUnit}
          canEdit={canEdit}
          onRoomEdit={handleRoomEdit}
          onRoomDelete={handleRoomDelete}
        />
      )}
      
      {otherRooms.length > 0 && (
        <RoomList
          title="Other Rooms"
          rooms={otherRooms}
          type="otherRoom"
          measurementUnit={measurementUnit}
          canEdit={canEdit}
          onRoomEdit={handleRoomEdit}
          onRoomDelete={handleRoomDelete}
        />
      )}
    </div>
  );
};

export default RoomsTab;
