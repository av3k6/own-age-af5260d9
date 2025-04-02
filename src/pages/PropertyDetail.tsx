
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockListings } from "@/data/mockData";
import { PropertyListing, ListingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      
      // First check mock data (for demo purposes)
      const mockProperty = mockListings.find((listing) => listing.id === id);
      
      if (mockProperty) {
        // If listing is pending and user is not the owner, don't display it
        if (mockProperty.status === ListingStatus.PENDING && 
            mockProperty.sellerId !== user?.id && 
            !user?.isAdmin) {
          setProperty(null);
          setIsLoading(false);
          return;
        }
        
        setProperty(mockProperty);
        setIsLoading(false);
        return;
      }
      
      // If not found in mock data, try to fetch from Supabase
      try {
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
          console.error("Error fetching property:", error);
          setProperty(null);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          // Check if listing is pending and user is not the owner
          if (data.status === ListingStatus.PENDING && 
              data.seller_id !== user?.id && 
              !user?.isAdmin) {
            setProperty(null);
            setIsLoading(false);
            return;
          }
          
          // Transform the raw data to match PropertyListing type
          const formattedProperty: PropertyListing = {
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price,
            address: data.address,
            propertyType: data.property_type,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            squareFeet: data.square_feet,
            yearBuilt: data.year_built,
            features: data.features || [],
            images: data.images || [],
            sellerId: data.seller_id,
            status: data.status,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
            roomDetails: {
              ...data.room_details,
              listingNumber: data.listing_number
            }
          };
          
          setProperty(formattedProperty);
        } else {
          setProperty(null);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        setProperty(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, supabase, toast, user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center">
        <div className="text-center">
          <p className="text-zen-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return <PropertyNotFound />;
  }

  return <PropertyDetailView property={property} />;
};

export default PropertyDetail;
