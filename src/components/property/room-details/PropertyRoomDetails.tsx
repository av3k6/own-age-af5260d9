
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import KeyFactsTab from "./KeyFactsTab";
import DetailsTab from "./DetailsTab";
import RoomsTab from "./RoomsTab";

interface PropertyRoomDetailsProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
  listingStatus?: string;
}

const PropertyRoomDetails = ({
  bedrooms = [],
  otherRooms = [],
  propertyDetails,
  propertyTitle,
  propertyPrice,
  listingStatus = 'active',
}: PropertyRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState("keyFacts");
  const [measurementUnit, setMeasurementUnit] = useState("Feet");
  
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
            <KeyFactsTab 
              propertyTitle={propertyTitle}
              propertyDetails={propertyDetails}
              listingStatus={listingStatus}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <DetailsTab 
              bedrooms={bedrooms}
              otherRooms={otherRooms}
              propertyDetails={propertyDetails}
            />
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            <RoomsTab 
              bedrooms={bedrooms}
              otherRooms={otherRooms}
              propertyDetails={propertyDetails}
              propertyTitle={propertyTitle}
              propertyPrice={propertyPrice}
              measurementUnit={measurementUnit}
              setMeasurementUnit={setMeasurementUnit}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyRoomDetails;
