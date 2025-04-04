
import React, { useState, useEffect } from "react";
import { PropertyListing } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFavorites } from "@/hooks/property/useFavorites";
import { useSupabase } from "@/hooks/useSupabase";
import PropertyCard from "@/components/property/PropertyCard";
import { useToast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";
import { Skeleton } from "@/components/ui/skeleton";

const logger = createLogger("FavoritePropertiesSection");

const FavoritePropertiesSection = () => {
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFavoriteProperties = async () => {
      if (favoritesLoading || !favorites || favorites.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .in("id", favorites);

        if (error) {
          logger.error("Error fetching favorite properties:", error);
          toast({
            title: "Error",
            description: "Failed to load favorite properties",
            variant: "destructive"
          });
          return;
        }

        if (data) {
          // Format property listings to match the expected shape
          const formattedProperties = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description || "",
            price: item.price,
            address: item.address,
            propertyType: item.property_type,
            bedrooms: item.bedrooms || 0,
            bathrooms: item.bathrooms || 0,
            squareFeet: item.square_feet || 0,
            yearBuilt: item.year_built || 0,
            features: item.features || [],
            images: item.images || [],
            sellerId: item.seller_id,
            sellerName: item.seller_name || "",
            sellerEmail: item.seller_email || "",
            status: item.status || "active",
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
            roomDetails: {}
          }));
          
          setFavoriteProperties(formattedProperties);
        }
      } catch (error) {
        logger.error("Exception fetching favorite properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProperties();
  }, [favorites, favoritesLoading, supabase, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Favorite Properties</CardTitle>
        <CardDescription>Properties you've marked as favorites</CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">
              You haven't added any properties to your favorites yet
            </p>
            <p className="text-sm text-muted-foreground">
              Click the heart icon on any property to add it to your favorites
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritePropertiesSection;
