
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

export const usePrimaryPhoto = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Set photo as primary
  const setPrimaryPhoto = async (photoId: string) => {
    if (!propertyId) return false;
    
    try {
      // First, set all photos to non-primary
      await supabase
        .from('property_photos')
        .update({ is_primary: false })
        .eq('property_id', propertyId);
      
      // Then set the selected photo as primary
      await supabase
        .from('property_photos')
        .update({ is_primary: true })
        .eq('id', photoId);
      
      toast({
        title: "Success",
        description: "Primary photo updated",
      });
      
      return true;
    } catch (error) {
      console.error('Error setting primary photo:', error);
      toast({
        title: "Error",
        description: "Failed to update primary photo",
        variant: "destructive",
      });
      return false;
    }
  };

  return { setPrimaryPhoto };
};
