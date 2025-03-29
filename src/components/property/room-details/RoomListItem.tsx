
import React from "react";
import { Room } from "@/types";

interface RoomListItemProps {
  room: Room;
  index: number;
}

const RoomListItem = ({ room, index }: RoomListItemProps) => {
  return (
    <div className={`p-4 ${index % 2 === 0 ? 'bg-muted/40' : ''}`}>
      <div className="flex justify-between">
        <div>
          <h4 className="font-medium">
            {room.name}{room.dimensions ? ` (${room.dimensions})` : ''}
          </h4>
          {room.features && room.features.length > 0 && (
            <p className="text-sm text-muted-foreground">{room.features.join(', ')}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm">Level: {room.level}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomListItem;
