
import { useEffect, useState } from "react";
import { PropertyListing, ListingStatus } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { mockListings } from "@/data/mockData";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<PropertyListing[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch both mock data and database data
    const fetchListings = async () => {
      setIsLoading(true);
      
      try {
        // Get mock listings immediately to show something quickly
        let activeMockListings = mockListings
          .filter(listing => listing.status === ListingStatus.ACTIVE)
          .slice(0, 6);
        
        let allListings = [...activeMockListings];
        setFeaturedListings(allListings); // Set initial data quickly
        
        try {
          // Try to fetch from Supabase with a timeout
          const fetchPromise = supabase
            .from('property_listings')
            .select('*')
            .eq('status', ListingStatus.ACTIVE)
            .limit(6);
          
          // Set a timeout for the database query
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database query timed out')), 5000)
          );
          
          const { data, error } = await Promise.race([
            fetchPromise,
            timeoutPromise as Promise<any>
          ]);
            
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
            allListings = [...activeMockListings, ...supabaseListings];
            setFeaturedListings(allListings);
          }
        } catch (err) {
          console.error("Failed to fetch featured listings from Supabase:", err);
          // We already displayed mock data, so we don't need to show an error to the user
        }
      } catch (err) {
        console.error("Failed to load any listings:", err);
        toast({
          title: "Error loading listings",
          description: "We're having trouble loading the latest properties. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
    
    // Load saved province from localStorage on component mount
    try {
      const savedProvince = localStorage.getItem("selectedProvince");
      if (savedProvince) {
        setSelectedProvince(savedProvince);
      }
    } catch (error) {
      console.error("Error loading province from localStorage:", error);
    }
  }, [supabase]);

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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
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
