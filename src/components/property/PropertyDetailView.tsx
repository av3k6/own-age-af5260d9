
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Calendar, CheckCircle, XCircle, Edit } from "lucide-react";

import { PropertyListing } from "@/types";
import PropertyGallery from "./PropertyGallery";
import PropertyDescription from "./PropertyDescription";
import PropertyFeatures from "./PropertyFeatures";
import PropertyLocation from "./PropertyLocation";
import PropertyRoomDetails from "./PropertyRoomDetails";
import PropertyInformation from "./PropertyInformation";
import PropertyFloorPlans from "./PropertyFloorPlans";
import MortgageCalculator from "./MortgageCalculator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { isPropertyOwner } from "@/utils/propertyOwnershipUtils";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PropertyDetailView");

const PropertyDetailView = ({ property }: { property: PropertyListing }) => {
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (user && property) {
      setIsOwner(isPropertyOwner(property, user.id, user.email));
    } else {
      setIsOwner(false);
    }
  }, [user, property]);
  
  // Log the property data to debug
  useEffect(() => {
    logger.info("Property data received:", {
      id: property.id,
      hasRoomDetails: !!property.roomDetails,
      keys: Object.keys(property)
    });
  }, [property]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Property Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
            </div>
          </div>
          {isOwner && (
            <Link to={`/edit-listing/${property.id}?tab=basic`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Listing
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Property Gallery */}
      <PropertyGallery images={property.images} />

      {/* Mobile Action Buttons - Only show on mobile */}
      <div className="md:hidden mt-6 space-y-3">
        {!isOwner && (
          <MobilePropertyActions 
            propertyId={property.id} 
            propertyTitle={property.title} 
            sellerId={property.sellerId}
          />
        )}
      </div>

      {/* Property Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="col-span-2 space-y-8">
          <PropertyDescription property={property} />
          <PropertyFeatures property={property} />
          
          {/* Conditionally render room details if they exist */}
          {property.roomDetails && Object.keys(property.roomDetails).length > 0 && (
            <PropertyRoomDetails propertyId={property.id} roomDetails={property.roomDetails} />
          )}
          
          {/* Floor Plans Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <PropertyFloorPlans propertyId={property.id} />
          </div>
          
          <PropertyLocation property={property} />
          
          {/* Add Mortgage Calculator below Location */}
          <MortgageCalculator propertyPrice={property.price} />
        </div>

        {/* Sidebar Content - Only show on desktop */}
        <div className="hidden md:block space-y-6">
          {/* Property Information with Action Buttons */}
          <PropertyInformation property={property} />
        </div>
      </div>
    </div>
  );
};

// New component for mobile property actions
const MobilePropertyActions = ({ propertyId, propertyTitle, sellerId }: { 
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}) => {
  const { user } = useAuth();
  
  return (
    <>
      <Link to="#" onClick={(e) => {
        e.preventDefault();
        document.getElementById("schedule-showing-button")?.click();
      }} className="block">
        <Button variant="default" className="w-full flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Schedule a Showing
        </Button>
      </Link>
      
      <Link to="#" onClick={(e) => {
        e.preventDefault();
        document.getElementById("contact-seller-button")?.click();
      }} className="block">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Seller
        </Button>
      </Link>
      
      <Link to={`/property/${propertyId}/make-offer`} className="block">
        <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
          Make an Offer
        </Button>
      </Link>
    </>
  );
};

export default PropertyDetailView;
