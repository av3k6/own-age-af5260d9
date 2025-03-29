
import React from "react";
import { PropertyRoomDetails } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface PropertySectionProps {
  propertyDetails?: PropertyRoomDetails;
}

const PropertySection = ({ propertyDetails }: PropertySectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Property</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Property Type" value={propertyDetails?.style} />
        <PropertyDetailSection label="Style" value={propertyDetails?.style} />
        <PropertyDetailSection label="Fronting on" value={propertyDetails?.frontingOn} />
        <PropertyDetailSection label="Community" value={propertyDetails?.community} />
        <PropertyDetailSection label="Municipality" value={propertyDetails?.municipality} />
      </div>
    </>
  );
};

export default PropertySection;
