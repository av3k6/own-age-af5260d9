
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { PropertyListing } from "@/types";

interface PropertyGridProps {
  listings: PropertyListing[];
  clearFilters: () => void;
}

const PropertyGrid = ({ listings, clearFilters }: PropertyGridProps) => {
  return (
    <>
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <PropertyCard key={listing.id} property={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-zen-gray-800 mb-2">
            No properties found
          </h3>
          <p className="text-zen-gray-600">
            Try adjusting your search criteria or clear filters to see more results.
          </p>
          <Button onClick={clearFilters} className="mt-4">
            Clear All Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default PropertyGrid;
