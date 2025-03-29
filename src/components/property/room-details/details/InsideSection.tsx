
import React from "react";
import { PropertyRoomDetails, Room } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface InsideSectionProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetails;
}

const InsideSection = ({ 
  bedrooms = [], 
  otherRooms = [], 
  propertyDetails 
}: InsideSectionProps) => {
  const formatYesNo = (value: boolean | string | number) => 
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString();

  return (
    <>
      <h3 className="text-lg font-medium mb-4 mt-8">Inside</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Bedrooms" value={bedrooms.length} />
        <PropertyDetailSection label="Bathrooms" value={propertyDetails?.bathrooms} />
        <PropertyDetailSection label="Kitchens" value={propertyDetails?.kitchens} />
        <PropertyDetailSection label="Rooms" value={otherRooms?.length} />
        <PropertyDetailSection 
          label="Family Room" 
          value={propertyDetails?.familyRoom} 
          formatter={formatYesNo}
        />
        <PropertyDetailSection 
          label="Central Vac" 
          value={propertyDetails?.centralVac} 
          formatter={formatYesNo}
        />
        <PropertyDetailSection 
          label="Fireplace" 
          value={propertyDetails?.fireplace}
          formatter={formatYesNo}
        />
        <PropertyDetailSection label="Basement Type" value={propertyDetails?.basement} />
      </div>
    </>
  );
};

export default InsideSection;
