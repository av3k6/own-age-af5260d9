
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Room {
  name: string;
  level: string;
  dimensions?: string;
}

interface Feature {
  name: string;
  value: string;
}

interface PropertyRoomDetailsProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  heating?: string;
  cooling?: string;
  appliances?: Feature[];
  features?: Feature[];
  parkingSpaces?: number;
  parkingFeatures?: string[];
  hasGarage?: boolean;
  stories?: number;
  lotSize?: string;
  parcelNumber?: string;
  hasPool?: boolean;
  poolFeatures?: string[];
  accessibilityFeatures?: string[];
}

const PropertyRoomDetails = ({
  bedrooms = [],
  otherRooms = [],
  heating,
  cooling,
  appliances = [],
  features = [],
  parkingSpaces,
  parkingFeatures = [],
  hasGarage,
  stories,
  lotSize,
  parcelNumber,
  hasPool,
  poolFeatures = [],
  accessibilityFeatures = [],
}: PropertyRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState("interior");
  
  const renderRoomList = (rooms: Room[]) => {
    return (
      <div className="space-y-4">
        {rooms.map((room, index) => (
          <div key={`${room.name}-${index}`} className="space-y-1">
            <h4 className="font-medium">{room.name}</h4>
            <p className="text-sm text-muted-foreground">Level: {room.level}</p>
            {room.dimensions && <p className="text-sm text-muted-foreground">Dimensions: {room.dimensions}</p>}
            {index < rooms.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">Facts & Features</h2>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="interior">Interior</TabsTrigger>
            <TabsTrigger value="property">Property</TabsTrigger>
            <TabsTrigger value="lot">Lot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interior" className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Bedrooms & Bathrooms</h3>
              {bedrooms.length > 0 ? (
                renderRoomList(bedrooms)
              ) : (
                <p className="text-muted-foreground">No detailed bedroom information available.</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Other Rooms</h3>
              {otherRooms.length > 0 ? (
                renderRoomList(otherRooms)
              ) : (
                <p className="text-muted-foreground">No detailed room information available.</p>
              )}
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-3">Heating & Cooling</h3>
                <div className="space-y-2">
                  {heating && (
                    <div>
                      <span className="font-medium">Heating: </span>
                      <span>{heating}</span>
                    </div>
                  )}
                  {cooling && (
                    <div>
                      <span className="font-medium">Cooling: </span>
                      <span>{cooling}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-3">Appliances & Features</h3>
                <div className="space-y-2">
                  {appliances.length > 0 && (
                    <div>
                      <span className="font-medium">Appliances: </span>
                      <span>{appliances.map(a => `${a.name}: ${a.value}`).join(', ')}</span>
                    </div>
                  )}
                  {features.length > 0 && (
                    <div className="space-y-1">
                      {features.map((feature, index) => (
                        <div key={index}>
                          <span className="font-medium">{feature.name}: </span>
                          <span>{feature.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="property" className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Parking</h3>
              <div className="space-y-2">
                {parkingSpaces !== undefined && (
                  <div>
                    <span className="font-medium">Total spaces: </span>
                    <span>{parkingSpaces}</span>
                  </div>
                )}
                {parkingFeatures.length > 0 && (
                  <div>
                    <span className="font-medium">Parking features: </span>
                    <span>{parkingFeatures.join(', ')}</span>
                  </div>
                )}
                {hasGarage !== undefined && (
                  <div>
                    <span className="font-medium">Has garage: </span>
                    <span>{hasGarage ? 'Yes' : 'No'}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Accessibility</h3>
              <div className="space-y-2">
                {accessibilityFeatures.length > 0 ? (
                  <div>
                    <span className="font-medium">Accessibility features: </span>
                    <span>{accessibilityFeatures.join(', ')}</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No accessibility information available.</p>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-medium mb-3">Features</h3>
              <div className="space-y-2">
                {stories !== undefined && (
                  <div>
                    <span className="font-medium">Stories: </span>
                    <span>{stories}</span>
                  </div>
                )}
                {hasPool !== undefined && (
                  <div>
                    <span className="font-medium">Has private pool: </span>
                    <span>{hasPool ? 'Yes' : 'No'}</span>
                  </div>
                )}
                {poolFeatures.length > 0 && (
                  <div>
                    <span className="font-medium">Pool features: </span>
                    <span>{poolFeatures.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="lot" className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-3">Lot Information</h3>
              <div className="space-y-2">
                {lotSize && (
                  <div>
                    <span className="font-medium">Size: </span>
                    <span>{lotSize}</span>
                  </div>
                )}
                {parcelNumber && (
                  <div>
                    <span className="font-medium">Parcel number: </span>
                    <span>{parcelNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyRoomDetails;
