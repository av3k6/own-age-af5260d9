
import { useEffect, useState } from "react";
import { PropertyListing, ListingStatus } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { mockListings } from "@/data/mockData";
import { useSupabase } from "@/hooks/useSupabase";

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<PropertyListing[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    // Fetch both mock data and database data
    const fetchListings = async () => {
      // Filter mock data to only include active listings
      let activeMockListings = mockListings
        .filter(listing => listing.status === ListingStatus.ACTIVE)
        .slice(0, 6);
      
      let allListings = [...activeMockListings];
      
      try {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('status', ListingStatus.ACTIVE)
          .limit(6);
          
        if (data && !error) {
          // Transform Supabase data to match PropertyListing type
          const supabaseListings = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            address: item.address,
            propertyType: item.property_type,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            squareFeet: item.square_feet,
            yearBuilt: item.year_built,
            features: item.features || [],
            images: item.images || [],
            sellerId: item.seller_id,
            status: item.status,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
          })) as PropertyListing[];
          
          // Add Supabase listings to the array
          allListings = [...allListings, ...supabaseListings];
        }
      } catch (err) {
        console.error("Failed to fetch featured listings from Supabase:", err);
      }
      
      setFeaturedListings(allListings);
    };
    
    fetchListings();
  }, [supabase]);

  // Load saved province from localStorage on component mount
  useEffect(() => {
    try {
      const savedProvince = localStorage.getItem("selectedProvince");
      if (savedProvince) {
        setSelectedProvince(savedProvince);
      }
    } catch (error) {
      console.error("Error loading province from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Filter listings based on selected province
    if (selectedProvince === "all") {
      setFilteredListings(featuredListings);
    } else {
      const filtered = featuredListings.filter(
        listing => listing.address && listing.address.state === selectedProvince
      );
      setFilteredListings(filtered);
    }
  }, [selectedProvince, featuredListings]);

  return (
    <section className="py-12 bg-gray-50 dark:bg-background/95 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zen-gray-800 dark:text-white">Featured Properties</h2>
          <p className="mt-2 text-lg text-zen-gray-600 dark:text-gray-200">
            Discover our hand-picked selection of exceptional properties
          </p>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-lg text-zen-gray-600 dark:text-gray-300">
              No active properties found in this province.
            </p>
            <p className="mt-2 text-zen-gray-500 dark:text-gray-400">
              Try selecting a different province or check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
