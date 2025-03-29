
import { Link } from "react-router-dom";
import { mockListings } from "@/data/mockData";
import { formatCurrency } from "@/lib/formatters";
import { PropertyType } from "@/types";

interface PropertySimilarProps {
  currentPropertyId: string;
  propertyType: PropertyType;
  city: string;
}

export default function PropertySimilar({ currentPropertyId, propertyType, city }: PropertySimilarProps) {
  const similarProperties = mockListings
    .filter(
      (listing) =>
        listing.id !== currentPropertyId &&
        listing.propertyType === propertyType &&
        listing.address.city === city
    )
    .slice(0, 3);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Similar Properties</h2>
      
      <div className="space-y-4">
        {similarProperties.map((listing) => (
          <Link key={listing.id} to={`/property/${listing.id}`}>
            <div className="flex space-x-3 group">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              
              <div>
                <h3 className="font-medium text-zen-gray-800 group-hover:text-zen-blue-500 transition-colors">
                  {listing.title}
                </h3>
                
                <p className="text-zen-blue-500 text-sm font-medium">
                  {formatCurrency(listing.price)}
                </p>
                
                <p className="text-zen-gray-600 text-xs">
                  {listing.bedrooms} bd • {listing.bathrooms} ba • {listing.squareFeet.toLocaleString()} sqft
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
