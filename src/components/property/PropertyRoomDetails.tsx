
import React from 'react';
import { PropertyRoomDetails as PropertyRoomDetailsType } from '@/types';

interface PropertyRoomDetailsProps {
  propertyId: string;
  roomDetails?: PropertyRoomDetailsType;
  sellerId?: string; // Keep the sellerId prop
}

const PropertyRoomDetails: React.FC<PropertyRoomDetailsProps> = ({ propertyId, roomDetails, sellerId }) => {
  // Early return if no room details to prevent rendering issues
  if (!roomDetails) {
    return null;
  }

  // Check if both bedrooms and otherRooms are empty/undefined, return null to prevent empty rendering
  if ((!roomDetails.bedrooms || roomDetails.bedrooms.length === 0) && 
      (!roomDetails.otherRooms || roomDetails.otherRooms.length === 0)) {
    return null;
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Room Details</h2>
      
      {roomDetails.bedrooms && roomDetails.bedrooms.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Bedrooms</h3>
          <ul className="space-y-2">
            {roomDetails.bedrooms.map((bedroom, i) => (
              <li key={`bedroom-${i}-${bedroom.name}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{bedroom.name}</span>
                  {bedroom.level && <span className="text-sm text-gray-500 ml-2">Level: {bedroom.level}</span>}
                </div>
                {bedroom.dimensions && <span className="text-sm">{bedroom.dimensions}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {roomDetails.otherRooms && roomDetails.otherRooms.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Other Rooms</h3>
          <ul className="space-y-2">
            {roomDetails.otherRooms.map((room, i) => (
              <li key={`other-room-${i}-${room.name}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{room.name}</span>
                  {room.level && <span className="text-sm text-gray-500 ml-2">Level: {room.level}</span>}
                </div>
                {room.dimensions && <span className="text-sm">{room.dimensions}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyRoomDetails;
