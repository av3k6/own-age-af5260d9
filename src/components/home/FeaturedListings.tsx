
import { useEffect, useState } from "react";
import { PropertyListing } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { mockListings } from "@/data/mockData";

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<PropertyListing[]>([]);

  useEffect(() => {
    // Simulate data fetching
    // In a real app, you'd fetch from an API
    setFeaturedListings(mockListings.slice(0, 3));
  }, []);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zen-gray-800">Featured Properties</h2>
          <p className="mt-2 text-lg text-zen-gray-600">
            Discover our hand-picked selection of exceptional properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <PropertyCard key={listing.id} property={listing} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
