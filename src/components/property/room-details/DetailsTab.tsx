
import React from "react";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import PropertySection from "./details/PropertySection";
import InsideSection from "./details/InsideSection";
import BuildingSection from "./details/BuildingSection";
import ParkingSection from "./details/ParkingSection";
import LandSection from "./details/LandSection";
import UtilitiesSection from "./details/UtilitiesSection";

interface DetailsTabProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
}

const DetailsTab = ({ 
  bedrooms = [], 
  otherRooms = [], 
  propertyDetails 
}: DetailsTabProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PropertySection propertyDetails={propertyDetails} />
          <InsideSection 
            bedrooms={bedrooms} 
            otherRooms={otherRooms} 
            propertyDetails={propertyDetails} 
          />
        </div>
        
        <div>
          <BuildingSection propertyDetails={propertyDetails} />
          <ParkingSection propertyDetails={propertyDetails} />
          <LandSection propertyDetails={propertyDetails} />
          <UtilitiesSection propertyDetails={propertyDetails} />
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
