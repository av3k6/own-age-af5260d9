
import React from "react";
import { Room } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { levelOptions } from "@/components/listing/steps/property-features/utils/propertyFeatures";
import { Save, X } from "lucide-react";

interface EditRoomFormProps {
  room: Room;
  measurementUnit: string;
  onSave: (room: Room) => void;
  onCancel: () => void;
  isNewRoom?: boolean;
}

const EditRoomForm = ({ 
  room, 
  measurementUnit, 
  onSave, 
  onCancel, 
  isNewRoom = false 
}: EditRoomFormProps) => {
  const [editedRoom, setEditedRoom] = React.useState<Room>(room);

  const handleChange = (field: keyof Room, value: string) => {
    setEditedRoom(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col space-y-3">
      {isNewRoom && (
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Add New Room</h4>
        </div>
      )}
      <Input 
        placeholder="Room name"
        value={editedRoom.name} 
        onChange={(e) => handleChange('name', e.target.value)} 
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Select
            value={editedRoom.level}
            onValueChange={(val) => handleChange('level', val)}
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
          value={editedRoom.dimensions || ''} 
          onChange={(e) => handleChange('dimensions', e.target.value)} 
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          {isNewRoom ? "Cancel" : <X className="h-4 w-4 mr-1" />}
        </Button>
        <Button onClick={() => onSave(editedRoom)}>
          {isNewRoom ? "Add" : <Save className="h-4 w-4 mr-1" />} {isNewRoom ? "" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default EditRoomForm;
