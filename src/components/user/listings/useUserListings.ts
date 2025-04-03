
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PropertyListing, ListingStatus } from "@/types";
import { createLogger } from "@/utils/logger";

const logger = createLogger("useUserListings");

export type DataSource = 'mock' | 'supabase' | 'both';

export const useUserListings = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<DataSource>('both');
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      logger.info("Fetching listings for user:", user.id, user.email);
      setDebugInfo(`Logged in user: ID=${user.id || 'unknown'}, Email=${user.email || 'unknown'}`);
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Track data sources
        let mockListingsFound = 0;
        let supabaseListingsFound = 0;
        let allListings: PropertyListing[] = [];
        
        // First try to get listings from property_listings table
        // Don't filter in the query to see what's actually in the database
        const { data: allDbListings, error } = await supabase
          .from("property_listings")
          .select("*");
          
        if (error) {
          logger.error("Error fetching all listings:", error.message);
          setError(`Database error: ${error.message}`);
          setDataSource('mock'); // Will only use mock data
          setDebugInfo(prev => `${prev}\n❌ Supabase error: ${error.message}`);
        } else {
          // Log all listings for debugging
          logger.info("All listings found in Supabase:", allDbListings?.length || 0);
          setDebugInfo(prev => `${prev}\n📊 Total listings in Supabase: ${allDbListings?.length || 0}`);
          
          if (allDbListings && allDbListings.length > 0) {
            // Log IDs for debugging
            const listingIds = allDbListings.map(l => ({ 
              id: l.id, 
              seller_id: l.seller_id,
              email: l.seller_email || "no_email"
            }));
            logger.info("Listings in database:", listingIds);
            setDebugInfo(prev => `${prev}\n🔑 All listing IDs: ${JSON.stringify(listingIds)}`);
            
            // Now filter on client side to catch any potential matching issues
            let userListings = [];
            if (allDbListings) {
              userListings = allDbListings.filter(listing => {
                const matchesId = listing.seller_id === user.id;
                const matchesEmail = listing.seller_email === user.email;
                
                if (matchesId) {
                  logger.info(`Found listing ${listing.id} matching user ID ${user.id}`);
                  setDebugInfo(prev => `${prev}\n✅ Found listing matching your ID: ${listing.id}`);
                }
                if (matchesEmail) {
                  logger.info(`Found listing ${listing.id} matching user email ${user.email}`);
                  setDebugInfo(prev => `${prev}\n✅ Found listing matching your email: ${listing.id}`);
                }
                
                // Look for your specific listing ID
                if (listing.id === "74f46615-8c3d-4e68-8704-212ffe40d454") {
                  logger.info(`Found your specific listing: ${listing.id}, seller_id: ${listing.seller_id}`);
                  setDebugInfo(prev => `${prev}\n🎯 Found your specific listing! Owner: ${listing.seller_id}`);
                }
                
                return matchesId || matchesEmail;
              });
              
              logger.info("Filtered Supabase listings for this user:", userListings.length);
              setDebugInfo(prev => `${prev}\n✅ Supabase listings matching your account: ${userListings.length}`);
              
              supabaseListingsFound = userListings.length;
              
              // Transform the raw data to match PropertyListing type
              const formattedListings = userListings.map(listing => ({
                id: listing.id,
                title: listing.title || "Untitled Property",
                description: listing.description || "",
                price: listing.price || 0,
                address: listing.address || {
                  street: "",
                  city: "",
                  state: "",
                  zipCode: "",
                },
                propertyType: listing.property_type || "house",
                bedrooms: listing.bedrooms || 0,
                bathrooms: listing.bathrooms || 0,
                squareFeet: listing.square_feet || 0,
                yearBuilt: listing.year_built || 0,
                features: listing.features || [],
                images: listing.images || [],
                sellerId: listing.seller_id || user.id,
                status: (listing.status as ListingStatus) || ListingStatus.ACTIVE,
                createdAt: new Date(listing.created_at),
                updatedAt: new Date(listing.updated_at),
                source: 'supabase' as 'supabase', // Mark the source
              })) as (PropertyListing & { source: 'supabase' })[];
              
              allListings = [...allListings, ...formattedListings];
            }
          }
        }
        
        // Check mock data as well
        // Import the mock data directly to avoid circular dependencies
        import("@/data/mockData").then(({ mockListings }) => {
          // Find mock listings "owned" by this user
          const userMockListings = mockListings.filter(listing => 
            listing.sellerId === user.id || 
            // Since mock data doesn't have seller_email, we can't match by email
            false
          );
          
          mockListingsFound = userMockListings.length;
          logger.info("Mock listings found for this user:", mockListingsFound);
          setDebugInfo(prev => `${prev}\n🔸 Mock listings matching your account: ${mockListingsFound}`);
          
          // Mark mock listings with a source field for debugging
          const markedMockListings = userMockListings.map(listing => ({
            ...listing,
            source: 'mock' as 'mock',
          }));
          
          // Combine with any supabase listings
          allListings = [...allListings, ...markedMockListings];
          
          // Set the data source for UI display
          if (supabaseListingsFound > 0 && mockListingsFound > 0) {
            setDataSource('both');
          } else if (supabaseListingsFound > 0) {
            setDataSource('supabase');
          } else if (mockListingsFound > 0) {
            setDataSource('mock');
          }
          
          // Log combined results
          logger.info("Total listings to display:", allListings.length, 
            "(Supabase:", supabaseListingsFound, 
            "Mock:", mockListingsFound, ")");
            
          setDebugInfo(prev => `${prev}\n📊 Total listings to display: ${allListings.length} (${supabaseListingsFound} from Supabase + ${mockListingsFound} from mock data)`);
          
          setListings(allListings);
          setIsLoading(false);
        });
        
      } catch (err: any) {
        logger.error("Unexpected error while fetching listings:", err);
        setError(`Failed to load listings: ${err.message}`);
        setListings([]);
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [user, supabase, toast]);

  return {
    isLoading,
    listings,
    error,
    dataSource,
    debugInfo,
    setListings,
    setDataSource
  };
};
