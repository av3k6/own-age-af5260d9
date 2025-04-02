
import React from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType } from "@/types";
import PropertyDetailSection from "./PropertyDetailSection";
import ListingNumberDisplay from "@/components/property/ListingNumberDisplay";

interface KeyFactsTabProps {
  propertyTitle?: string;
  propertyDetails?: PropertyRoomDetailsType;
  listingStatus?: string;
}

const KeyFactsTab = ({ propertyTitle, propertyDetails, listingStatus }: KeyFactsTabProps) => {
  const isPending = listingStatus === 'pending';
  
  return (
    <div>
      {propertyTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Key facts for {propertyTitle}</h3>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-4">
          <PropertyDetailSection 
            label="Tax"
            value={propertyDetails?.taxes && `${propertyDetails.taxes} / ${propertyDetails.taxYear || 'year'}`}
          />
          
          <PropertyDetailSection 
            label="Property Type"
            value={propertyDetails?.style}
          />
          
          <PropertyDetailSection 
            label="Lot Size"
            value={propertyDetails?.lotSize}
          />
          
          <PropertyDetailSection 
            label="Parking"
            value={propertyDetails?.totalParkingSpaces && propertyDetails.garageType && propertyDetails.garageSpaces ? 
              `${propertyDetails.garageType} ${propertyDetails.garageSpaces} ${propertyDetails.garageSpaces > 1 ? 'garages' : 'garage'}, total ${propertyDetails.totalParkingSpaces} parkings` : 
              undefined}
          />
          
          <PropertyDetailSection 
            label="Basement"
            value={propertyDetails?.basement}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="text-muted-foreground">Listing #:</span>
            <ListingNumberDisplay 
              listingNumber={propertyDetails?.listingNumber} 
              listingStatus={listingStatus}
              showLabel={false}
            />
          </div>
          
          <PropertyDetailSection 
            label="Days on Market"
            value={propertyDetails?.daysOnMarket ? `${propertyDetails.daysOnMarket} days` : undefined}
            hidden={isPending}
          />
          
          <PropertyDetailSection 
            label="Property Days on Market"
            value={propertyDetails?.propertyDaysOnMarket ? `${propertyDetails.propertyDaysOnMarket} days` : undefined}
            hidden={isPending}
          />
          
          <PropertyDetailSection 
            label="Status Change"
            value={propertyDetails?.statusChange}
            hidden={isPending}
          />
          
          <PropertyDetailSection 
            label="Listed on"
            value={propertyDetails?.listedOn ? formatDate(propertyDetails.listedOn) : undefined}
            hidden={isPending}
          />
          
          <PropertyDetailSection 
            label="Updated on"
            value={propertyDetails?.updatedOn ? formatDate(propertyDetails.updatedOn) : undefined}
            hidden={isPending}
          />
        </div>
      </div>
      
    </div>
  );
};

export default KeyFactsTab;
