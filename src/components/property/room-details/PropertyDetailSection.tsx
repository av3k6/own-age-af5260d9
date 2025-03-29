
import React from "react";

interface PropertyDetailSectionProps {
  label: string;
  value?: string | number | boolean;
  formatter?: (value: string | number | boolean) => React.ReactNode;
  hidden?: boolean;
}

const PropertyDetailSection = ({ 
  label, 
  value,
  formatter,
  hidden = false
}: PropertyDetailSectionProps) => {
  if (hidden || value === undefined) return null;
  
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}:</span>
      <span>{formatter ? formatter(value) : value.toString()}</span>
    </div>
  );
};

export default PropertyDetailSection;
