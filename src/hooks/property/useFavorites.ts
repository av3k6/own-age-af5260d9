
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";

const logger = createLogger("useFavourites");

export interface Favourite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user favourites
  const fetchFavorites = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("property_favorites")
        .select("property_id")
        .eq("user_id", user.id);

      if (error) {
        logger.error("Error fetching favourites:", error);
        return;
      }

      const propertyIds = data.map(fav => fav.property_id);
      setFavorites(propertyIds);
    } catch (error) {
      logger.error("Exception fetching favourites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favourite status for a property
  const toggleFavorite = async (propertyId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favourites",
        variant: "destructive"
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(propertyId);

      if (isFavorite) {
        // Remove from favourites
        logger.info("Removing from favourites:", propertyId);
        const { error } = await supabase
          .from("property_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("property_id", propertyId);

        if (error) {
          logger.error("Error removing favourite:", error);
          toast({
            title: "Error",
            description: "Failed to remove from favourites",
            variant: "destructive"
          });
          return;
        }

        setFavorites(prev => prev.filter(id => id !== propertyId));
        toast({
          title: "Removed from favourites",
          description: "Property removed from your favourites",
          variant: "default"
        });
      } else {
        // Add to favourites
        logger.info("Adding to favourites:", propertyId);
        const { error } = await supabase
          .from("property_favorites")
          .insert({
            user_id: user.id,
            property_id: propertyId
          });

        if (error) {
          logger.error("Error adding favourite:", error);
          toast({
            title: "Error",
            description: "Failed to add to favourites",
            variant: "destructive"
          });
          return;
        }

        setFavorites(prev => [...prev, propertyId]);
        toast({
          title: "Added to favourites",
          description: "Property added to your favourites",
          variant: "default"
        });
      }
    } catch (error) {
      logger.error("Exception toggling favourite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Check if a property is in favourites
  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  // Load favourites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [user?.id]);

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    refreshFavorites: fetchFavorites
  };
};
