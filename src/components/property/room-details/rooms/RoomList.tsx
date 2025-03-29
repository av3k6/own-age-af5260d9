
import React from "react";
import { Room } from "@/types";
import RoomItem from "./RoomItem";

interface RoomListProps {
  title: string;
  rooms: Room[];
  type: 'bedroom' | 'otherRoom';
  measurementUnit: string;
  canEdit: boolean;
  onRoomEdit: (index: number, type: 'bedroom' | 'otherRoom', editedRoom: Room) => void;
  onRoomDelete: (index: number, type: 'bedroom' | 'otherRoom') => void;
}

const RoomList = ({ 
  title,
  rooms, 
  type, 
  measurementUnit, 
  canEdit, 
  onRoomEdit, 
  onRoomDelete 
}: RoomListProps) => {
  if (!rooms.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {title} ({rooms.length})
      </h3>
      <div className="space-y-4">
        {rooms.map((room, index) => (
          <RoomItem
            key={`${room.name}-${index}`}
            room={room}
            index={index}
            type={type}
            measurementUnit={measurementUnit}
            canEdit={canEdit}
            onEdit={(editedRoom) => onRoomEdit(index, type, editedRoom)}
            onDelete={() => onRoomDelete(index, type)}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
