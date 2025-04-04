
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditListing } from "@/hooks/useEditListing";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import { createLogger } from "@/utils/logger";

// Import new components
import HeaderSection from "@/components/edit-listing/HeaderSection";
import LoadingState from "@/components/edit-listing/LoadingState";
import ErrorState from "@/components/edit-listing/ErrorState";
import ListingTabsContent from "@/components/edit-listing/ListingTabsContent";
import PhotosTabContent from "@/components/edit-listing/PhotosTabContent";
import OpenHouseTabContent from "@/components/edit-listing/OpenHouseTabContent";

const logger = createLogger("EditListing");

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get tab from URL query or default to "basic"
  const tabFromQuery = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromQuery || "basic");
  
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
    propertyDetails,
    error,
    errorLoading,
    fetchAttempted
  } = useEditListing(id);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    logger.info("EditListing: Tab changed to:", newTab);
    setActiveTab(newTab);
    searchParams.set("tab", newTab);
    setSearchParams(searchParams);
  };

  // Add debug logging
  useEffect(() => {
    logger.info("EditListing: Rendered with activeTab:", activeTab);
    logger.info("EditListing: propertyId:", id);
    
    if (error) {
      logger.error("EditListing: Error loading property:", error);
    }
  }, [activeTab, id, error]);

  const onSubmit = form.handleSubmit((data) => {
    logger.info("EditListing: Main form submitted with data:", data);
    saveProperty(data);
  });

  // Handle retrying the fetch
  const handleRetry = () => {
    logger.info("EditListing: Retrying property fetch");
    window.location.reload();
  };

  // Improved navigation handler that uses React Router's navigate
  const handleCancel = () => {
    logger.info("EditListing: Cancel button clicked");
    if (id) {
      navigate(`/property/${id}`);
    }
  };

  // Show property not found if there was an error loading the property
  if (errorLoading && fetchAttempted) {
    return <PropertyNotFound errorType="edit-not-found" propertyId={id} />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  // Show an error message with retry button if there was an error but we don't want to show the not found page
  if (error && !errorLoading) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <HeaderSection 
          propertyId={id}
          listingNumber={propertyDetails?.listingNumber}
          listingStatus={form.watch("status")}
        />

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="rooms">Room Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="floorPlans">Floor Plans</TabsTrigger>
            <TabsTrigger value="openHouse">Open House</TabsTrigger>
          </TabsList>
          
          {/* Form tabs content */}
          <ListingTabsContent 
            activeTab={activeTab}
            form={form}
            bedroomRooms={bedroomRooms}
            setBedroomRooms={setBedroomRooms}
            otherRooms={otherRooms}
            setOtherRooms={setOtherRooms}
            floorPlans={floorPlans}
            setFloorPlans={setFloorPlans}
            propertyId={id}
            onSubmit={onSubmit}
            isSaving={isSaving}
            handleCancel={handleCancel}
            handleTabChange={handleTabChange}
          />
          
          {/* Photos tab content */}
          <PhotosTabContent 
            propertyId={id}
            handleCancel={handleCancel}
            handleTabChange={handleTabChange}
          />
          
          {/* Open House tab content */}
          <OpenHouseTabContent 
            propertyId={id}
            handleCancel={handleCancel}
            handleTabChange={handleTabChange}
          />
        </Tabs>
      </div>
    </div>
  );
}
