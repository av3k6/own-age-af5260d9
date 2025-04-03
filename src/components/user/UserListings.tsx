
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Loader2, Calendar, Clock, AlertCircle } from "lucide-react";
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

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      logger.info("Fetching listings for user:", user.id, user.email);
      
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get listings from property_listings table
        const { data, error } = await supabase
          .from("property_listings")
          .select("*");
          
        if (error) {
          logger.error("Error fetching all listings:", error.message);
          setError(`Database error: ${error.message}`);
          setListings([]);
          setIsLoading(false);
          return;
        }
        
        // Log all listings for debugging
        logger.info("All listings found:", data?.length || 0);
        
        if (data && data.length > 0) {
          // Check for any seller_id inconsistencies
          logger.info("Sample listing seller_ids:", data.slice(0, 3).map(l => ({ 
            id: l.id, 
            seller_id: l.seller_id,
            email: l.seller_email || "no_email"
          })));
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
          
          logger.info("Filtered listings for this user:", userListings.length);
          
          // If no listings were found, log additional information
          if (userListings.length === 0) {
            logger.info("User details:", { id: user.id, email: user.email });
            logger.info("No listings found with this user ID or email. Check if the listings were created with a different account.");
          }
        } else {
          userListings = [];
        }

        // Transform the raw data to match PropertyListing type
        const formattedListings = userListings ? userListings.map(listing => ({
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
          sellerId: listing.seller_id || user.id,  // Set user id as fallback
          // Convert the status string to a valid ListingStatus enum value
          status: (listing.status as ListingStatus) || ListingStatus.ACTIVE,
          createdAt: new Date(listing.created_at),
          updatedAt: new Date(listing.updated_at),
        })) as PropertyListing[] : [];

        setListings(formattedListings);
      } catch (err: any) {
        logger.error("Unexpected error while fetching listings:", err);
        setError(`Failed to load listings: ${err.message}`);
        // Set empty listings instead of showing an error
        setListings([]);
      } finally {
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
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any property listings yet.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  If you believe you should see listings here, they might have been created with a different account.
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
                    <div className="absolute top-2 right-2 z-10">
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
