
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyListing } from "@/types";

type PropertyGridProps = {
  listings: PropertyListing[];
};

export const PropertyGrid = ({ listings }: PropertyGridProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="relative">
          <PropertyCard property={listing} />
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            {/* Source badge */}
            <div className={`text-xs px-2 py-1 rounded-full ${(listing as any).source === 'mock' ? 'bg-orange-200 text-orange-800' : 'bg-blue-200 text-blue-800'}`}>
              {(listing as any).source === 'mock' ? 'Mock' : 'Supabase'}
            </div>
            <Button 
              size="sm" 
              variant="secondary" 
              className="h-8 px-2"
              onClick={() => navigate(`/property/${listing.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" /> View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
