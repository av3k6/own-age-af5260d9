
import React, { useState } from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { levelOptions } from "@/components/listing/steps/property-features/utils/propertyFeatures";
import { Pencil, X, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [editingRoomType, setEditingRoomType] = useState<'bedroom' | 'otherRoom' | null>(null);
  const [editedRoom, setEditedRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomType, setNewRoomType] = useState<'bedroom' | 'otherRoom'>('bedroom');
  const [newRoom, setNewRoom] = useState<Room>({ name: '', level: 'Main Floor', dimensions: '' });
  
  // Start editing a room
  const startEditRoom = (index: number, type: 'bedroom' | 'otherRoom', room: Room) => {
    setEditingRoomIndex(index);
    setEditingRoomType(type);
    setEditedRoom({ ...room });
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setEditingRoomIndex(null);
    setEditingRoomType(null);
    setEditedRoom(null);
  };
  
  // Save edited room
  const saveEditedRoom = () => {
    if (!editedRoom || editingRoomIndex === null || !editingRoomType || !onRoomChange) return;
    
    let updatedBedrooms = [...bedrooms];
    let updatedOtherRooms = [...otherRooms];
    
    if (editingRoomType === 'bedroom') {
      updatedBedrooms[editingRoomIndex] = editedRoom;
    } else {
      updatedOtherRooms[editingRoomIndex] = editedRoom;
    }
    
    onRoomChange(updatedBedrooms, updatedOtherRooms);
    toast({
      title: "Room updated",
      description: "Room details have been updated successfully.",
    });
    cancelEdit();
  };
  
  // Delete a room
  const deleteRoom = (index: number, type: 'bedroom' | 'otherRoom') => {
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
  const addNewRoom = () => {
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
    
    if (newRoomType === 'bedroom') {
      updatedBedrooms.push({ ...newRoom });
    } else {
      updatedOtherRooms.push({ ...newRoom });
    }
    
    onRoomChange(updatedBedrooms, updatedOtherRooms);
    setNewRoom({ name: '', level: 'Main Floor', dimensions: '' });
    setIsAddingRoom(false);
    toast({
      title: "Room added",
      description: `New ${newRoomType === 'bedroom' ? 'bedroom' : 'room'} has been added successfully.`,
    });
  };
  
  const renderRoomList = (rooms: Room[], type: 'bedroom' | 'otherRoom') => {
    return (
      <div className="space-y-4">
        {rooms.map((room, index) => {
          // Check if this room is being edited
          const isEditing = editingRoomIndex === index && editingRoomType === type;
          
          return (
            <Card key={`${room.name}-${index}`} className="p-4">
              {isEditing ? (
                <div className="flex flex-col space-y-3">
                  <Input 
                    placeholder="Room name" 
                    value={editedRoom?.name || ''} 
                    onChange={(e) => setEditedRoom(prev => prev ? {...prev, name: e.target.value} : null)} 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Select
                        value={editedRoom?.level || 'Main Floor'}
                        onValueChange={(val) => setEditedRoom(prev => prev ? {...prev, level: val} : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {levelOptions.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input 
                      placeholder={`Dimensions (${measurementUnit})`}
                      value={editedRoom?.dimensions || ''} 
                      onChange={(e) => setEditedRoom(prev => prev ? {...prev, dimensions: e.target.value} : null)} 
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={cancelEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveEditedRoom}>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{room.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {type === 'bedroom' ? 'Bedroom' : 'Room'}
                      </span>
                      {canEdit && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditRoom(index, type, room)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteRoom(index, type)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Level: </span>
                      {room.level}
                    </div>
                    {room.dimensions && (
                      <div>
                        <span className="text-muted-foreground">Dimensions: </span>
                        {room.dimensions} {measurementUnit}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    );
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Measurement Unit:</span>
          <select 
            value={measurementUnit}
            onChange={(e) => setMeasurementUnit(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm text-foreground bg-background"
          >
            <option value="Feet">Feet</option>
            <option value="Meters">Meters</option>
          </select>
        </div>
      </div>
      
      {isAddingRoom && (
        <Card className="p-4 mb-6">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Add New Room</h4>
              <Select
                value={newRoomType}
                onValueChange={(val: 'bedroom' | 'otherRoom') => setNewRoomType(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="otherRoom">Other Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input 
              placeholder="Room name"
              value={newRoom.name} 
              onChange={(e) => setNewRoom(prev => ({...prev, name: e.target.value}))} 
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Select
                  value={newRoom.level}
                  onValueChange={(val) => setNewRoom(prev => ({...prev, level: val}))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levelOptions.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input 
                placeholder={`Dimensions (${measurementUnit})`}
                value={newRoom.dimensions || ''} 
                onChange={(e) => setNewRoom(prev => ({...prev, dimensions: e.target.value}))} 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsAddingRoom(false)}>
                Cancel
              </Button>
              <Button onClick={addNewRoom}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {bedrooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Bedrooms ({bedrooms.length})
          </h3>
          {renderRoomList(bedrooms, 'bedroom')}
        </div>
      )}
      
      {otherRooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Other Rooms ({otherRooms.length})
          </h3>
          {renderRoomList(otherRooms, 'otherRoom')}
        </div>
      )}
    </div>
  );
};

export default RoomsTab;
