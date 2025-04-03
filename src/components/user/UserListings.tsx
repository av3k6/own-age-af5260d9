import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Loader2, Calendar, Clock, AlertCircle, Info } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyListing, ListingStatus } from "@/types";
import ShowingRequestManager from "./showings/ShowingRequestManager";
import SellerAvailabilityManager from "./showings/SellerAvailabilityManager";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { createLogger } from "@/utils/logger";

const logger = createLogger("UserListings");

const UserListings = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'mock' | 'supabase' | 'both'>('both');
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
        const { data, error } = await supabase
          .from("property_listings")
          .select("*");
          
        if (error) {
          logger.error("Error fetching all listings:", error.message);
          setError(`Database error: ${error.message}`);
          setDataSource('mock'); // Will only use mock data
          setDebugInfo(prev => `${prev}\n❌ Supabase error: ${error.message}`);
        } else {
          // Log all listings for debugging
          logger.info("All listings found in Supabase:", data?.length || 0);
          setDebugInfo(prev => `${prev}\n📊 Total listings in Supabase: ${data?.length || 0}`);
          
          if (data && data.length > 0) {
            // Log IDs for debugging
            const listingIds = data.map(l => ({ 
              id: l.id, 
              seller_id: l.seller_id,
              email: l.seller_email || "no_email"
            }));
            logger.info("Listings in database:", listingIds);
            setDebugInfo(prev => `${prev}\n🔑 Sample listing IDs: ${JSON.stringify(listingIds.slice(0, 3))}`);
          }
          
          // Now filter by seller_id OR seller_email as fallback
          let userListings = [];
          if (data) {
            userListings = data.filter(listing => {
              const matchesId = listing.seller_id === user.id;
              const matchesEmail = listing.seller_email === user.email;
              
              if (matchesId) logger.info(`Found listing ${listing.id} matching user ID ${user.id}`);
              if (matchesEmail) logger.info(`Found listing ${listing.id} matching user email ${user.email}`);
              
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

  const handleCreateListing = () => {
    navigate("/sell");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Property Management</CardTitle>
          <CardDescription>Manage your listings and showings</CardDescription>
        </div>
        <Button onClick={handleCreateListing}>
          <Plus className="h-4 w-4 mr-2" /> New Listing
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Your Listings</span>
            </TabsTrigger>
            <TabsTrigger value="showings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Showing Requests</span>
            </TabsTrigger>
            <TabsTrigger value="availability" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Availability</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="listings">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {/* Data source info */}
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Data Source: {dataSource === 'both' ? 'Supabase & Mock Data' : dataSource === 'supabase' ? 'Supabase' : 'Mock Data'}</AlertTitle>
              <AlertDescription className="whitespace-pre-line text-xs font-mono">
                {debugInfo}
              </AlertDescription>
            </Alert>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any property listings yet.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  If you believe you should see listings here, they might have been created with a different account.
                  <br/>
                  Current user ID: {user?.id || 'not logged in'}
                  <br/>
                  Email: {user?.email || 'no email'}
                </p>
                <Button onClick={handleCreateListing} variant="outline">
                  Create Your First Listing
                </Button>
              </div>
            ) : (
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
            )}
          </TabsContent>
          
          <TabsContent value="showings">
            <ShowingRequestManager isBuyer={false} />
          </TabsContent>
          
          <TabsContent value="availability">
            <SellerAvailabilityManager />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserListings;
