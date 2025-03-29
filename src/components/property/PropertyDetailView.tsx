
import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyListing } from "@/types";
import { Button } from "@/components/ui/button";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInformation from "./PropertyInformation";
import PropertyDescription from "./PropertyDescription";
import PropertyFeatures from "./PropertyFeatures";
import PropertyLocation from "./PropertyLocation";
import PropertyProfessionals from "./PropertyProfessionals";
import PropertySimilar from "./PropertySimilar";

interface PropertyDetailViewProps {
  property: PropertyListing;
}

export default function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<string>(property.images[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/buy" className="text-zen-blue-500 hover:text-zen-blue-600">
              &larr; Back to Search Results
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Gallery */}
            <div className="lg:w-2/3">
              <PropertyImageGallery 
                images={property.images} 
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                title={property.title}
              />
            </div>
            
            {/* Property Information */}
            <div className="lg:w-1/3">
              <PropertyInformation property={property} />
            </div>
          </div>
          
          {/* Property Details */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PropertyDescription description={property.description} />
              <PropertyFeatures features={property.features} />
              <PropertyLocation address={property.address} />
            </div>
            
            <div>
              <PropertyProfessionals />
              <PropertySimilar 
                currentPropertyId={property.id} 
                propertyType={property.propertyType} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
