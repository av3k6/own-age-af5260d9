
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PropertyPhoto } from "./types";

export const useFetchPhotos = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPhotos = async () => {
    if (!propertyId) {
      console.log("useFetchPhotos: No propertyId provided");
      setIsLoading(false);
      return [];
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching photos for property:", propertyId);
      const { data, error } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching photos:', error);
        toast({
          title: "Database Error",
          description: "Could not load property photos. Please try refreshing the page.",
          variant: "destructive",
        });
        setPhotos([]);
        return [];
      } else {
        console.log("Fetched photos:", data?.length || 0);
        setPhotos(data || []);
        return data || [];
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load property photos",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { photos, setPhotos, isLoading, fetchPhotos };
};
