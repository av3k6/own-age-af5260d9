
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
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("seller_id", user.id);

        if (error) {
          console.error("Error fetching user listings:", error);
          toast({
            title: "Error",
            description: "Failed to load your property listings",
            variant: "destructive",
          });
          return;
        }

        // Transform the raw data to match PropertyListing type
        const formattedListings = data.map(listing => ({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          address: listing.address,
          propertyType: listing.property_type,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          squareFeet: listing.square_feet,
          yearBuilt: listing.year_built,
          features: listing.features || [],
          images: listing.images || [],
          sellerId: listing.seller_id,
          status: listing.status as ListingStatus,
          createdAt: new Date(listing.created_at),
          updatedAt: new Date(listing.updated_at),
        }));

        setListings(formattedListings);
      } catch (err) {
        console.error("Failed to fetch listings:", err);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
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
