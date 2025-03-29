
import React from "react";
import { PropertyRoomDetails } from "@/types";
import PropertyDetailSection from "../PropertyDetailSection";

interface ParkingSectionProps {
  propertyDetails?: PropertyRoomDetails;
}

const ParkingSection = ({ propertyDetails }: ParkingSectionProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-4 mt-8">Parking</h3>
      <div className="space-y-4">
        <PropertyDetailSection label="Driveway" value={propertyDetails?.driveway} />
        <PropertyDetailSection label="Garage Type" value={propertyDetails?.garageType} />
        <PropertyDetailSection label="Garage" value={propertyDetails?.garageSpaces} />
        <PropertyDetailSection label="Total Parking Space" value={propertyDetails?.totalParkingSpaces} />
      </div>
    </>
  );
};

export default ParkingSection;
