
import React from "react";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import PropertyDetailSection from "./PropertyDetailSection";

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
  const formatYesNo = (value: boolean | string | number) => 
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString();
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Property</h3>
          <div className="space-y-4">
            <PropertyDetailSection label="Property Type" value={propertyDetails?.style} />
            <PropertyDetailSection label="Style" value={propertyDetails?.style} />
            <PropertyDetailSection label="Fronting on" value={propertyDetails?.frontingOn} />
            <PropertyDetailSection label="Community" value={propertyDetails?.community} />
            <PropertyDetailSection label="Municipality" value={propertyDetails?.municipality} />
          </div>
          
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
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Building</h3>
          <div className="space-y-4">
            <PropertyDetailSection label="Construction" value={propertyDetails?.construction} />
            <PropertyDetailSection label="Pool" value={propertyDetails?.pool} />
          </div>
          
          <h3 className="text-lg font-medium mb-4 mt-8">Parking</h3>
          <div className="space-y-4">
            <PropertyDetailSection label="Driveway" value={propertyDetails?.driveway} />
            <PropertyDetailSection label="Garage Type" value={propertyDetails?.garageType} />
            <PropertyDetailSection label="Garage" value={propertyDetails?.garageSpaces} />
            <PropertyDetailSection label="Total Parking Space" value={propertyDetails?.totalParkingSpaces} />
          </div>
          
          <h3 className="text-lg font-medium mb-4 mt-8">Land</h3>
          <div className="space-y-4">
            <PropertyDetailSection label="Sewer" value={propertyDetails?.sewer} />
            <PropertyDetailSection label="Frontage" value={propertyDetails?.frontage} />
            <PropertyDetailSection label="Depth" value={propertyDetails?.depth} />
            <PropertyDetailSection label="Lot Size" value={propertyDetails?.lotSize} />
            <PropertyDetailSection label="Lot Size Code" value={propertyDetails?.lotSizeCode} />
            <PropertyDetailSection label="Cross Street" value={propertyDetails?.crossStreet} />
          </div>
          
          <h3 className="text-lg font-medium mb-4 mt-8">Utilities</h3>
          <div className="space-y-4">
            <PropertyDetailSection label="Water" value={propertyDetails?.water} />
            <PropertyDetailSection label="Cooling" value={propertyDetails?.cooling} />
            <PropertyDetailSection label="Heating Type" value={propertyDetails?.heating} />
            <PropertyDetailSection label="Heating Fuel" value={propertyDetails?.heatingFuel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
