
import React from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import RoomListItem from "./RoomListItem";

interface RoomsTabProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
  measurementUnit: string;
  setMeasurementUnit: (unit: string) => void;
}

const RoomsTab = ({
  bedrooms = [],
  otherRooms = [],
  propertyDetails,
  propertyTitle,
  propertyPrice,
  measurementUnit,
  setMeasurementUnit,
}: RoomsTabProps) => {
  
  const renderRoomList = (rooms: Room[]) => {
    return (
      <div className="space-y-2">
        {rooms.map((room, index) => (
          <RoomListItem key={`${room.name}-${index}`} room={room} index={index} />
        ))}
      </div>
    );
  };

  if (!bedrooms.length && !otherRooms.length) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        No room details available for this property
      </div>
    );
  }

  return (
    <div>
      {propertyTitle && propertyPrice && (
        <p className="text-muted-foreground mb-4">
          Room details for {propertyTitle}. 
          {propertyDetails?.listedOn && ` Listed for $${propertyPrice.toLocaleString()} on ${formatDate(propertyDetails.listedOn)}`}
        </p>
      )}
      
      <div className="mb-4">
        <select 
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="Feet">Feet</option>
          <option value="Meters">Meters</option>
        </select>
      </div>
      
      {bedrooms.length > 0 && (
        <>
          <h3 className="text-lg font-medium mb-2">Bedrooms</h3>
          {renderRoomList(bedrooms)}
        </>
      )}
      
      {otherRooms.length > 0 && (
        <>
          <h3 className="text-lg font-medium my-4">Other Rooms</h3>
          {renderRoomList(otherRooms)}
        </>
      )}
    </div>
  );
};

export default RoomsTab;
