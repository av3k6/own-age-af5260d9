
import React from "react";
import { PropertyRoomDetails } from "@/types";

interface PropertyDetailSectionProps {
  label: string;
  value?: string | number | boolean;
  formatter?: (value: string | number | boolean) => React.ReactNode;
}

const PropertyDetailSection = ({ 
  label, 
  value,
  formatter 
}: PropertyDetailSectionProps) => {
  if (value === undefined) return null;
  
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}:</span>
      <span>{formatter ? formatter(value) : value.toString()}</span>
    </div>
  );
};

export default PropertyDetailSection;
