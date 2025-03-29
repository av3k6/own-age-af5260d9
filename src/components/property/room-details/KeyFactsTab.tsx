
import React from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType } from "@/types";
import PropertyDetailSection from "./PropertyDetailSection";

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
          <PropertyDetailSection 
            label="Listing #"
            value={propertyDetails?.listingNumber}
          />
          
          <PropertyDetailSection 
            label="Data Source"
            value={propertyDetails?.dataSource}
          />
          
          <PropertyDetailSection 
            label="Predicted Days on Market"
            value={propertyDetails?.predictedDaysOnMarket}
          />
          
          {propertyDetails?.predictedDaysOnMarket !== undefined && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="relative w-full">
                  <span 
                    className="absolute top-4 left-0 text-xs">
                    Fast
                  </span>
                  <span 
                    className="absolute top-4 left-1/2 -translate-x-1/2 text-xs">
                    {propertyDetails?.predictedDaysOnMarket || 20} days
                  </span>
                  <span 
                    className="absolute top-4 right-0 text-xs">
                    Very Slow
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <PropertyDetailSection 
            label="Listing Brokerage"
            value={propertyDetails?.listingBrokerage}
          />
          
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
      
      {propertyDetails?.marketDemand && (
        <div className="mt-8">
          <p className="text-muted-foreground mb-2">Market Demand:</p>
          <div className="w-full bg-gradient-to-r from-blue-400 via-green-400 to-red-400 rounded-full h-2.5 relative">
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-teal-500 rounded-full"></div>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-xs">Buyer's Market</span>
              <span className="text-xs">Balanced</span>
              <span className="text-xs">Seller's Market</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyFactsTab;
