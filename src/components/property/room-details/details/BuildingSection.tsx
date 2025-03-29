
import React from "react";
import { PropertyRoomDetails } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface BuildingSectionProps {
  propertyDetails?: PropertyRoomDetails;
}

const BuildingSection = ({ propertyDetails }: BuildingSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4">Building</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Construction" value={propertyDetails?.construction} />
        <PropertyDetailSection label="Pool" value={propertyDetails?.pool} />
      </div>
    </>
  );
};

export default BuildingSection;
