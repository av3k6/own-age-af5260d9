
import React from "react";
import { Room } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, X } from "lucide-react";
import EditRoomForm from "./EditRoomForm";

interface RoomItemProps {
  room: Room;
  index: number;
  type: 'bedroom' | 'otherRoom';
  measurementUnit: string;
  canEdit: boolean;
  onEdit: (editedRoom: Room) => void;
  onDelete: () => void;
}

const RoomItem = ({ 
  room, 
  index, 
  type, 
  measurementUnit, 
  canEdit, 
  onEdit, 
  onDelete 
}: RoomItemProps) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = (editedRoom: Room) => {
    onEdit(editedRoom);
    setIsEditing(false);
  };

  return (
    <Card key={`${room.name}-${index}`} className="p-4">
      {isEditing ? (
        <EditRoomForm
          room={room}
          measurementUnit={measurementUnit}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
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
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}>
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
};

export default RoomItem;
