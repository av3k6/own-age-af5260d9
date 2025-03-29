
import React from "react";
import { PropertyRoomDetails } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface LandSectionProps {
  propertyDetails?: PropertyRoomDetails;
}

const LandSection = ({ propertyDetails }: LandSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4 mt-8">Land</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Sewer" value={propertyDetails?.sewer} />
        <PropertyDetailSection label="Frontage" value={propertyDetails?.frontage} />
        <PropertyDetailSection label="Depth" value={propertyDetails?.depth} />
        <PropertyDetailSection label="Lot Size" value={propertyDetails?.lotSize} />
        <PropertyDetailSection label="Lot Size Code" value={propertyDetails?.lotSizeCode} />
        <PropertyDetailSection label="Cross Street" value={propertyDetails?.crossStreet} />
      </div>
    </>
  );
};

export default LandSection;
