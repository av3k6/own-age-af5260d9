
import React from "react";
import { PropertyListing } from "@/types";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInformation from "./PropertyInformation";
import PropertyDescription from "./PropertyDescription";
import PropertyFeatures from "./PropertyFeatures";
import PropertyLocation from "./PropertyLocation";
import PropertyRoomDetails from "./room-details/PropertyRoomDetails";
import PropertySimilar from "./PropertySimilar";
import PropertyProfessionals from "./PropertyProfessionals";

interface PropertyDetailViewProps {
  property: PropertyListing;
}

const PropertyDetailView = ({ property }: PropertyDetailViewProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 space-y-8">
      <PropertyImageGallery images={property.images} propertyTitle={property.title} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PropertyInformation property={property} />
          <PropertyDescription description={property.description} />
          <PropertyRoomDetails
            bedrooms={property.roomDetails?.bedrooms}
            otherRooms={property.roomDetails?.otherRooms}
            propertyDetails={property.roomDetails}
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
            priceRange={{ min: property.price * 0.8, max: property.price * 1.2 }}
            city={property.address.city}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailView;
