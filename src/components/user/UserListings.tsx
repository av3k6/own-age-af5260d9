
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Loader2 } from "lucide-react";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyListing, ListingStatus } from "@/types";

const UserListings = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<PropertyListing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // First try to get listings from property_listings table
        let { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("seller_id", user.id);

        // If the table doesn't exist or there's an error, check if we're in development/demo mode
        if (error) {
          console.log("Error fetching listings:", error.message);
          // Set empty listings instead of showing an error
          setListings([]);
          return;
        }

        // Transform the raw data to match PropertyListing type
        const formattedListings = data ? data.map(listing => ({
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
          sellerId: listing.seller_id,
          status: listing.status as ListingStatus || "active",
          createdAt: new Date(listing.created_at),
          updatedAt: new Date(listing.updated_at),
        })) : [];

        setListings(formattedListings);
      } catch (err) {
        console.error("Unexpected error while fetching listings:", err);
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
          <CardTitle className="text-xl">Your Property Listings</CardTitle>
          <CardDescription>Manage your property listings</CardDescription>
        </div>
        <Button onClick={handleCreateListing}>
          <Plus className="h-4 w-4 mr-2" /> New Listing
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any property listings yet.</p>
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
      </CardContent>
    </Card>
  );
};

export default UserListings;
