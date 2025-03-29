
import React from "react";
import { PropertyRoomDetails } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface UtilitiesSectionProps {
  propertyDetails?: PropertyRoomDetails;
}

const UtilitiesSection = ({ propertyDetails }: UtilitiesSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4 mt-8">Utilities</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Water" value={propertyDetails?.water} />
        <PropertyDetailSection label="Cooling" value={propertyDetails?.cooling} />
        <PropertyDetailSection label="Heating Type" value={propertyDetails?.heating} />
        <PropertyDetailSection label="Heating Fuel" value={propertyDetails?.heatingFuel} />
      </div>
    </>
  );
};

export default UtilitiesSection;
