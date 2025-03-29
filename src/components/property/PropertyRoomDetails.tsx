
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/formatters";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";

interface PropertyRoomDetailsProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
}

const PropertyRoomDetails = ({
  bedrooms = [],
  otherRooms = [],
  propertyDetails,
  propertyTitle,
  propertyPrice,
}: PropertyRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState("keyFacts");
  const [measurementUnit, setMeasurementUnit] = useState("Feet");
  
  const renderRoomList = (rooms: Room[]) => {
    return (
      <div className="space-y-2">
        {rooms.map((room, index) => (
          <div 
            key={`${room.name}-${index}`} 
            className={`p-4 ${index % 2 === 0 ? 'bg-muted/40' : ''}`}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{room.name}{room.dimensions ? `(${room.dimensions})` : ''}</h4>
                {room.features && room.features.length > 0 && (
                  <p className="text-sm text-muted-foreground">{room.features.join(', ')}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm">Level: {room.level}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderKeyFacts = () => {
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
            
            {propertyDetails?.yearBuilt && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Building Age:</span>
                <span>{propertyDetails.yearBuilt}</span>
              </div>
            )}
            
            {propertyDetails?.squareFeet && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Size:</span>
                <span>{propertyDetails.squareFeet} sq ft</span>
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

  const renderDetailsTab = () => {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Property</h3>
            <div className="space-y-4">
              {propertyDetails?.style && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Property Type:</span>
                  <span>{propertyDetails.style}</span>
                </div>
              )}
              
              {propertyDetails?.style && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Style:</span>
                  <span>{propertyDetails.style}</span>
                </div>
              )}
              
              {propertyDetails?.frontingOn && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fronting on:</span>
                  <span>{propertyDetails.frontingOn}</span>
                </div>
              )}
              
              {propertyDetails?.community && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Community:</span>
                  <span>{propertyDetails.community}</span>
                </div>
              )}
              
              {propertyDetails?.municipality && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Municipality:</span>
                  <span>{propertyDetails.municipality}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4 mt-8">Inside</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Bedrooms:</span>
                <span>{bedrooms.length}</span>
              </div>
              
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Bathrooms:</span>
                <span>{propertyDetails?.bathrooms || 0}</span>
              </div>
              
              {propertyDetails?.kitchens && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Kitchens:</span>
                  <span>{propertyDetails.kitchens}</span>
                </div>
              )}
              
              {otherRooms && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Rooms:</span>
                  <span>{otherRooms.length}</span>
                </div>
              )}
              
              {propertyDetails?.familyRoom !== undefined && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Family Room:</span>
                  <span>{propertyDetails.familyRoom ? 'Yes' : 'No'}</span>
                </div>
              )}
              
              {propertyDetails?.centralVac !== undefined && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Central Vac:</span>
                  <span>{propertyDetails.centralVac ? 'Yes' : 'No'}</span>
                </div>
              )}
              
              {propertyDetails?.fireplace !== undefined && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fireplace:</span>
                  <span>{propertyDetails.fireplace ? 'Yes' : 'No'}</span>
                </div>
              )}
              
              {propertyDetails?.basement && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Basement Type:</span>
                  <span>{propertyDetails.basement}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Building</h3>
            <div className="space-y-4">
              {propertyDetails?.construction && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Construction:</span>
                  <span>{propertyDetails.construction}</span>
                </div>
              )}
              
              {propertyDetails?.pool && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Pool:</span>
                  <span>{propertyDetails.pool}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4 mt-8">Parking</h3>
            <div className="space-y-4">
              {propertyDetails?.driveway && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Driveway:</span>
                  <span>{propertyDetails.driveway}</span>
                </div>
              )}
              
              {propertyDetails?.garageType && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Garage Type:</span>
                  <span>{propertyDetails.garageType}</span>
                </div>
              )}
              
              {propertyDetails?.garageSpaces !== undefined && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Garage:</span>
                  <span>{propertyDetails.garageSpaces}</span>
                </div>
              )}
              
              {propertyDetails?.totalParkingSpaces !== undefined && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Total Parking Space:</span>
                  <span>{propertyDetails.totalParkingSpaces}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4 mt-8">Land</h3>
            <div className="space-y-4">
              {propertyDetails?.sewer && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Sewer:</span>
                  <span>{propertyDetails.sewer}</span>
                </div>
              )}
              
              {propertyDetails?.frontage && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Frontage:</span>
                  <span>{propertyDetails.frontage}</span>
                </div>
              )}
              
              {propertyDetails?.depth && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Depth:</span>
                  <span>{propertyDetails.depth}</span>
                </div>
              )}
              
              {propertyDetails?.lotSize && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Lot Size:</span>
                  <span>{propertyDetails.lotSize}</span>
                </div>
              )}
              
              {propertyDetails?.lotSizeCode && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Lot Size Code:</span>
                  <span>{propertyDetails.lotSizeCode}</span>
                </div>
              )}
              
              {propertyDetails?.crossStreet && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Cross Street:</span>
                  <span>{propertyDetails.crossStreet}</span>
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-4 mt-8">Utilities</h3>
            <div className="space-y-4">
              {propertyDetails?.water && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Water:</span>
                  <span>{propertyDetails.water}</span>
                </div>
              )}
              
              {propertyDetails?.cooling && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Cooling:</span>
                  <span>{propertyDetails.cooling}</span>
                </div>
              )}
              
              {propertyDetails?.heating && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Heating Type:</span>
                  <span>{propertyDetails.heating}</span>
                </div>
              )}
              
              {propertyDetails?.heatingFuel && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Heating Fuel:</span>
                  <span>{propertyDetails.heatingFuel}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoomsTab = () => {
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
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">Facts & Features</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="keyFacts">Key Facts</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keyFacts" className="space-y-6">
            {renderKeyFacts()}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            {renderDetailsTab()}
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            {renderRoomsTab()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyRoomDetails;
