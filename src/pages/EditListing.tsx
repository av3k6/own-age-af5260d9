
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditListing } from "@/hooks/useEditListing";
import BasicDetailsTab from "@/components/edit-listing/BasicDetailsTab";
import RoomDetailsTab from "@/components/edit-listing/RoomDetailsTab";
import FloorPlanTab from "@/components/edit-listing/floor-plan/FloorPlanTab";
import OpenHouseTab from "@/components/edit-listing/open-house/OpenHouseTab";
import ListingNumberDisplay from "@/components/property/ListingNumberDisplay";

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    form,
    isLoading,
    isSaving,
    bedroomRooms,
    setBedroomRooms,
    otherRooms,
    setOtherRooms,
    floorPlans,
    setFloorPlans,
    saveProperty,
    propertyDetails
  } = useEditListing(id);

  const onSubmit = form.handleSubmit(saveProperty);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  // Improved navigation handler that uses React Router's navigate
  const handleCancel = () => {
    if (id) {
      window.location.href = `/property/${id}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to={`/property/${id}`} className="text-zen-blue-500 hover:text-zen-blue-600">
            &larr; Back to Property
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Property Listing</h1>
          {propertyDetails?.listingNumber && (
            <ListingNumberDisplay 
              listingNumber={propertyDetails.listingNumber} 
              listingStatus={form.watch("status")}
            />
          )}
        </div>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="rooms">Room Details</TabsTrigger>
                <TabsTrigger value="floorPlans">Floor Plans</TabsTrigger>
                <TabsTrigger value="openHouse">Open House</TabsTrigger>
              </TabsList>
              
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
                  propertyId={id}
                />
              </TabsContent>

              <TabsContent value="openHouse">
                <OpenHouseTab propertyId={id} />
              </TabsContent>
            </Tabs>

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
      </div>
    </div>
  );
}
