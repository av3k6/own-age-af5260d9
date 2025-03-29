
import React from "react";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType } from "@/types";

interface KeyFactsTabProps {
  propertyTitle?: string;
  propertyDetails?: PropertyRoomDetailsType;
}

const KeyFactsTab = ({ propertyTitle, propertyDetails }: KeyFactsTabProps) => {
  return (
    <div>
      {propertyTitle && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Key facts for {propertyTitle}</h3>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div className="space-y-4">
          {propertyDetails?.taxes && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Tax:</span>
              <span>{propertyDetails.taxes} / {propertyDetails.taxYear || 'year'}</span>
            </div>
          )}
          
          {propertyDetails?.style && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Property Type:</span>
              <span>{propertyDetails.style}</span>
            </div>
          )}
          
          {propertyDetails?.lotSize && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Lot Size:</span>
              <span>{propertyDetails.lotSize}</span>
            </div>
          )}
          
          {propertyDetails?.totalParkingSpaces && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Parking:</span>
              <span>
                {propertyDetails.garageType} {propertyDetails.garageSpaces} {propertyDetails.garageSpaces && propertyDetails.garageSpaces > 1 ? 'garages' : 'garage'}, 
                total {propertyDetails.totalParkingSpaces} parkings
              </span>
            </div>
          )}
          
          {propertyDetails?.basement && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Basement:</span>
              <span>{propertyDetails.basement}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {propertyDetails?.listingNumber && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Listing #:</span>
              <span>{propertyDetails.listingNumber}</span>
            </div>
          )}
          
          {propertyDetails?.dataSource && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Data Source:</span>
              <span>{propertyDetails.dataSource}</span>
            </div>
          )}
          
          {propertyDetails?.predictedDaysOnMarket !== undefined && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Predicted Days on Market:</span>
              <span>{propertyDetails.predictedDaysOnMarket}</span>
            </div>
          )}
          
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
          
          {propertyDetails?.listingBrokerage && (
            <div className="flex justify-between border-b pb-2 mt-8">
              <span className="text-muted-foreground">Listing Brokerage:</span>
              <span>{propertyDetails.listingBrokerage}</span>
            </div>
          )}
          
          {propertyDetails?.daysOnMarket !== undefined && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Days on Market:</span>
              <span>{propertyDetails.daysOnMarket} days</span>
            </div>
          )}
          
          {propertyDetails?.propertyDaysOnMarket !== undefined && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Property Days on Market:</span>
              <span>{propertyDetails.propertyDaysOnMarket} days</span>
            </div>
          )}
          
          {propertyDetails?.statusChange && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status Change:</span>
              <span>{propertyDetails.statusChange}</span>
            </div>
          )}
          
          {propertyDetails?.listedOn && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Listed on:</span>
              <span>{formatDate(propertyDetails.listedOn)}</span>
            </div>
          )}
          
          {propertyDetails?.updatedOn && (
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Updated on:</span>
              <span>{formatDate(propertyDetails.updatedOn)}</span>
            </div>
          )}
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
