
import React from "react";
import { PropertyListing, ListingStatus } from "@/types";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInformation from "./PropertyInformation";
import PropertyDescription from "./PropertyDescription";
import PropertyFeatures from "./PropertyFeatures";
import PropertyLocation from "./PropertyLocation";
import PropertyRoomDetails from "./room-details/PropertyRoomDetails";
import PropertySimilar from "./PropertySimilar";
import PropertyProfessionals from "./PropertyProfessionals";
import OpenHouseSchedule from "./OpenHouseSchedule";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import { createLogger } from "@/utils/logger";
import { Badge } from "@/components/ui/badge";

const logger = createLogger("PropertyDetailView");

interface PropertyDetailViewProps {
  property: PropertyListing;
}

const PropertyDetailView = ({ property }: PropertyDetailViewProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === property.sellerId;
  const isPending = property.status === ListingStatus.PENDING;
  const isExpired = property.status === ListingStatus.EXPIRED;
  
  // Extract listing number - check different possible locations
  let listingNumber = property.roomDetails?.listingNumber;
  
  // If it doesn't exist in the roomDetails, check if it's directly on the property
  if (!listingNumber && (property as any).listingNumber) {
    listingNumber = (property as any).listingNumber;
  }
  
  logger.info("Property detail view", { 
    propertyId: property.id, 
    status: property.status, 
    sellerId: property.sellerId,
    currentUserId: user?.id,
    isOwner,
    isPending,
    listingNumber
  });
  
  // If property is pending and user is not the owner, show restricted access
  if (isPending && !isOwner && !user?.isAdmin) {
    logger.info("Restricted access - property is pending and user is not owner");
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertTitle>Restricted Access</AlertTitle>
          <AlertDescription>
            This property listing is currently pending and only visible to the property owner and administrators.
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Property Not Available</h1>
          <p className="text-muted-foreground">
            This property is not currently active. Please check back later or browse other listings.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 space-y-8">
      {/* Expired banner */}
      {isExpired && (
        <div className="bg-[#ea384c] text-white p-4 rounded-md mb-4 flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <span className="font-bold text-lg mr-2">EXPIRED</span>
            <span>This listing is no longer active</span>
          </div>
          <Badge className="bg-white text-[#222] border-none">Expired</Badge>
        </div>
      )}
      
      {isPending && (
        <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <Shield className="h-4 w-4" />
          <AlertTitle>Pending Listing</AlertTitle>
          <AlertDescription>
            This property is currently in pending status and is not visible to other users.
          </AlertDescription>
        </Alert>
      )}
      
      <PropertyImageGallery 
        images={property.images} 
        title={property.title}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PropertyInformation property={property} />
          <PropertyDescription description={property.description} />
          
          {/* Open house schedule is now prominently displayed higher in the layout */}
          <OpenHouseSchedule propertyId={property.id} />
          
          <PropertyRoomDetails
            bedrooms={property.roomDetails?.bedrooms}
            otherRooms={property.roomDetails?.otherRooms}
            propertyDetails={{
              ...property.roomDetails,
              listingNumber: listingNumber // Ensure listing number is passed down
            }}
            propertyTitle={property.title}
            propertyPrice={property.price}
            listingStatus={property.status}
            propertyId={property.id}
            sellerId={property.sellerId}
          />
          <PropertyFeatures features={property.features} />
          <PropertyLocation address={property.address} />
        </div>
        
        <div className="space-y-8">
          <PropertyProfessionals propertyId={property.id} />
          <PropertySimilar
            currentPropertyId={property.id}
            propertyType={property.propertyType}
            city={property.address.city}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
