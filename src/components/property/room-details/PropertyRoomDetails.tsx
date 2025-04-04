
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyRoomDetails as PropertyRoomDetailsType, Room } from "@/types";
import KeyFactsTab from "./KeyFactsTab";
import DetailsTab from "./DetailsTab";
import RoomsTab from "./RoomsTab";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PropertyRoomDetailsProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
  listingStatus?: string;
  propertyId?: string;
  sellerId?: string;
}

const PropertyRoomDetails = ({
  bedrooms = [],
  otherRooms = [],
  propertyDetails,
  propertyTitle,
  propertyPrice,
  listingStatus = 'active',
  propertyId,
  sellerId,
}: PropertyRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState("keyFacts");
  const [measurementUnit, setMeasurementUnit] = useState("Feet");
  const [localBedrooms, setLocalBedrooms] = useState<Room[]>(bedrooms);
  const [localOtherRooms, setLocalOtherRooms] = useState<Room[]>(otherRooms);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if current user is the seller
  const canEdit = user?.id === sellerId;
  
  // Handle room changes (for editing)
  const handleRoomChange = async (newBedrooms: Room[], newOtherRooms: Room[]) => {
    if (!propertyId || !user?.id || user.id !== sellerId) return;
    
    setLocalBedrooms(newBedrooms);
    setLocalOtherRooms(newOtherRooms);
    
    try {
      // Update the room details in Supabase
      const { error } = await supabase
        .from("property_listings")
        .update({
          room_details: {
            ...(propertyDetails || {}),
            bedrooms: newBedrooms,
            otherRooms: newOtherRooms,
          },
        })
        .eq("id", propertyId)
        .eq("seller_id", user.id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating room details:", error);
      toast({
        title: "Error",
        description: "Failed to update room details. Please try again.",
        variant: "destructive"
      });
    }
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
            <KeyFactsTab 
              propertyTitle={propertyTitle}
              propertyDetails={propertyDetails}
              listingStatus={listingStatus}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <DetailsTab 
              bedrooms={localBedrooms}
              otherRooms={localOtherRooms}
              propertyDetails={propertyDetails}
            />
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            <RoomsTab 
              bedrooms={localBedrooms}
              otherRooms={localOtherRooms}
              propertyDetails={propertyDetails}
              propertyTitle={propertyTitle}
              propertyPrice={propertyPrice}
              measurementUnit={measurementUnit}
              setMeasurementUnit={setMeasurementUnit}
              canEdit={canEdit}
              onRoomChange={canEdit ? handleRoomChange : undefined}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertyRoomDetails;
