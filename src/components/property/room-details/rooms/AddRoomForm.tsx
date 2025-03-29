
import React, { useState } from "react";
import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditRoomForm from "./EditRoomForm";

interface AddRoomFormProps {
  measurementUnit: string;
  onRoomAdd: (newRoom: Room, type: 'bedroom' | 'otherRoom') => void;
  onCancel: () => void;
}

const AddRoomForm = ({ 
  measurementUnit, 
  onRoomAdd, 
  onCancel 
}: AddRoomFormProps) => {
  const [newRoomType, setNewRoomType] = useState<'bedroom' | 'otherRoom'>('bedroom');
  const [newRoom] = useState<Room>({ name: '', level: 'Main Floor', dimensions: '' });

  const handleAddRoom = (room: Room) => {
    if (!room.name.trim()) return;
    onRoomAdd(room, newRoomType);
  };

  return (
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
        <EditRoomForm
          room={newRoom}
          measurementUnit={measurementUnit}
          onSave={(room) => handleAddRoom(room)}
          onCancel={onCancel}
          isNewRoom
        />
      </div>
    </Card>
  );
};

export default AddRoomForm;
