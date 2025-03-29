
import { Link } from "react-router-dom";
import { PropertyListing } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: PropertyListing;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const {
    id,
    title,
    price,
    address,
    bedrooms,
    bathrooms,
    squareFeet,
    propertyType,
    images,
    status,
  } = property;

  // Use a placeholder image if no images are available
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : "/placeholder.svg";

  return (
    <Link to={`/property/${id}`}>
      <div className="property-card group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="property-image w-full h-48 object-cover"
          />
          
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="bg-zen-blue-500 hover:bg-zen-blue-500">
              {propertyType}
            </Badge>
          </div>
          
          <div className="absolute top-2 right-2">
            <Badge 
              variant={status === 'active' ? 'secondary' : 'outline'} 
              className={status === 'active' ? 'bg-green-500 hover:bg-green-500 text-white' : 
                       status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-500 text-white' :
                       status === 'sold' ? 'bg-blue-500 hover:bg-blue-500 text-white' : 
                       'bg-gray-500 hover:bg-gray-500 text-white'}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-zen-gray-800 dark:text-white line-clamp-1 group-hover:text-zen-blue-500 transition-colors">
            {title}
          </h3>
          
          <p className="text-lg font-bold text-zen-blue-500 dark:text-zen-blue-300 mt-1">
            {formatCurrency(price)}
          </p>
          
          <p className="text-zen-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
            {address?.street}, {address?.city}, {address?.state}
          </p>
          
          <div className="flex justify-between mt-3 text-zen-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {bedrooms} {bedrooms === 1 ? 'bed' : 'beds'}
            </span>
            
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {bathrooms} {bathrooms === 1 ? 'bath' : 'baths'}
            </span>
            
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              {squareFeet?.toLocaleString()} ft²
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
