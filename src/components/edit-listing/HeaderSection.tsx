
import React from "react";
import { Link } from "react-router-dom";
import ListingNumberDisplay from "@/components/property/ListingNumberDisplay";

interface HeaderSectionProps {
  propertyId?: string;
  listingNumber?: string;
  listingStatus?: string;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ 
  propertyId,
  listingNumber,
  listingStatus
}) => {
  return (
    <>
      <div className="mb-6">
        <Link to={`/property/${propertyId}`} className="text-zen-blue-500 hover:text-zen-blue-600">
          &larr; Back to Property
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Property Listing</h1>
        {listingNumber && (
          <ListingNumberDisplay 
            listingNumber={listingNumber} 
            listingStatus={listingStatus}
          />
        )}
      </div>
    </>
  );
};

export default HeaderSection;
