
import { PropertyListing, ListingStatus } from "@/types";
import { formatCurrency } from "@/lib/formatters";

interface PropertyInformationHeaderProps {
  property: PropertyListing;
  status: ListingStatus;
}

export default function PropertyInformationHeader({ property, status }: PropertyInformationHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-zen-blue-500 rounded-full mb-2">
          {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
        </span>
        
        <span className={`inline-block px-3 py-1 text-sm font-medium text-white rounded-full mb-2 ${
          status === ListingStatus.ACTIVE ? 'bg-green-500' : 'bg-yellow-500'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <h1 className="text-2xl font-bold text-zen-gray-800 mb-2">
        {property.title}
      </h1>
      
      <p className="text-zen-gray-600 mb-2">
        {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
      </p>
      
      <p className="text-2xl font-bold text-zen-blue-500 mb-2">
        {formatCurrency(property.price)}
      </p>
      
      <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 my-4">
        <div className="text-center">
          <p className="text-lg font-medium">{property.bedrooms}</p>
          <p className="text-xs text-zen-gray-600">Beds</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium">{property.bathrooms}</p>
          <p className="text-xs text-zen-gray-600">Baths</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium">{property.squareFeet.toLocaleString()}</p>
          <p className="text-xs text-zen-gray-600">Sq Ft</p>
        </div>
        
        <div className="text-center">
          <p className="text-lg font-medium">{property.yearBuilt || 'N/A'}</p>
          <p className="text-xs text-zen-gray-600">Year Built</p>
        </div>
      </div>
    </div>
  );
}
