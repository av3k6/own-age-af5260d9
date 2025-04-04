
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
import { createLogger } from "@/utils/logger";

const logger = createLogger("PropertyRoomDetails");

interface PropertyRoomDetailsProps {
  bedrooms?: Room[];
  otherRooms?: Room[];
  propertyDetails?: PropertyRoomDetailsType;
  propertyTitle?: string;
  propertyPrice?: number;
  listingStatus?: string;
  propertyId?: string;
  sellerId?: string;
  roomDetails?: any; // Added for compatibility with PropertyDetailView
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
  roomDetails,
}: PropertyRoomDetailsProps) => {
  const [activeTab, setActiveTab] = useState("keyFacts");
  const [measurementUnit, setMeasurementUnit] = useState("Feet");
  
  // Use roomDetails if provided (for backward compatibility)
  const details = roomDetails || propertyDetails;
  
  // Extract bedrooms and otherRooms from roomDetails if available
  const actualBedrooms = details?.bedrooms || bedrooms;
  const actualOtherRooms = details?.otherRooms || otherRooms;
  
  const [localBedrooms, setLocalBedrooms] = useState<Room[]>(actualBedrooms);
  const [localOtherRooms, setLocalOtherRooms] = useState<Room[]>(actualOtherRooms);
  
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if current user is the seller
  const canEdit = user?.id === sellerId;
  
  logger.info(`PropertyRoomDetails: User ${user?.id}, Seller: ${sellerId}, Can edit: ${canEdit}`);
  
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
            ...(details || {}),
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
              propertyDetails={details}
              listingStatus={listingStatus}
            />
          </TabsContent>
          
          <TabsContent value="details" className="space-y-6">
            <DetailsTab 
              bedrooms={localBedrooms}
              otherRooms={localOtherRooms}
              propertyDetails={details}
            />
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            <RoomsTab 
              bedrooms={localBedrooms}
              otherRooms={localOtherRooms}
              propertyDetails={details}
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
