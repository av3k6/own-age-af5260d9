
import React from "react";
import { Form } from "@/components/ui/form";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BasicDetailsTab from "@/components/edit-listing/BasicDetailsTab";
import RoomDetailsTab from "@/components/edit-listing/RoomDetailsTab";
import FloorPlanTab from "@/components/edit-listing/floor-plan/FloorPlanTab";
import { Room } from "@/types";
import { DocumentMetadata } from "@/types/document";
import { UseFormReturn } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";

interface ListingTabsContentProps {
  activeTab: string;
  form: UseFormReturn<EditListingFormValues>;
  bedroomRooms: Room[];
  setBedroomRooms: (rooms: Room[]) => void;
  otherRooms: Room[];
  setOtherRooms: (rooms: Room[]) => void;
  floorPlans: DocumentMetadata[];
  setFloorPlans: (plans: DocumentMetadata[]) => void;
  propertyId?: string;
  onSubmit: () => void;
  isSaving: boolean;
  handleCancel: () => void;
  handleTabChange: (tab: string) => void;
}

const ListingTabsContent: React.FC<ListingTabsContentProps> = ({
  activeTab,
  form,
  bedroomRooms,
  setBedroomRooms,
  otherRooms,
  setOtherRooms,
  floorPlans,
  setFloorPlans,
  propertyId,
  onSubmit,
  isSaving,
  handleCancel,
  handleTabChange
}) => {
  // Tabs that require the form wrapper
  if (activeTab === "basic" || activeTab === "rooms" || activeTab === "floorPlans") {
    return (
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }} className="space-y-6">
          <TabsContent value="basic">
            <BasicDetailsTab form={form} />
          </TabsContent>
          
          <TabsContent value="rooms">
            <RoomDetailsTab 
              bedroomRooms={bedroomRooms}
              setBedroomRooms={setBedroomRooms}
              otherRooms={otherRooms}
              setOtherRooms={setOtherRooms}
              bedroomCount={form.watch("bedrooms")}
            />
          </TabsContent>

          <TabsContent value="floorPlans">
            <FloorPlanTab
              floorPlans={floorPlans}
              setFloorPlans={setFloorPlans}
              propertyId={propertyId}
            />
          </TabsContent>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Update Listing"}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
  
  // Return null for other tabs since they're handled separately
  return null;
};

export default ListingTabsContent;
