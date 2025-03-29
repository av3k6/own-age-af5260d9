
import React from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import RoomListItem from "./RoomListItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  
  const renderRoomList = (rooms: Room[], type: string) => {
    return (
      <div className="space-y-4">
        {rooms.map((room, index) => (
          <Card key={`${room.name}-${index}`} className="p-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{room.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {type}
                </span>
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
          </Card>
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
    <div className="space-y-6">
      {propertyTitle && propertyPrice && (
        <p className="text-muted-foreground">
          Room details for {propertyTitle}. 
          {propertyDetails?.listedOn && ` Listed for $${propertyPrice.toLocaleString()} on ${formatDate(propertyDetails.listedOn)}`}
        </p>
      )}
      
      <div className="flex items-center justify-end gap-2 pb-4">
        <span className="text-sm text-muted-foreground">Measurement Unit:</span>
        <select 
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value="Feet">Feet</option>
          <option value="Meters">Meters</option>
        </select>
      </div>
      
      {bedrooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Bedrooms ({bedrooms.length})
          </h3>
          {renderRoomList(bedrooms, 'Bedroom')}
        </div>
      )}
      
      {otherRooms.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            Other Rooms ({otherRooms.length})
          </h3>
          {renderRoomList(otherRooms, 'Room')}
        </div>
      )}
    </div>
  );
};

export default RoomsTab;
