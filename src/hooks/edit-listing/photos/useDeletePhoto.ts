
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PropertyPhoto } from "./types";

export const useDeletePhoto = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Handle photo deletion
  const deletePhoto = async (
    photoId: string,
    photos: PropertyPhoto[],
    updatePhotoOrder: (photos: PropertyPhoto[]) => Promise<boolean>,
    setPrimaryPhoto: (photoId: string) => Promise<boolean>,
    fetchPhotos: () => Promise<PropertyPhoto[]>
  ) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('property_photos')
        .delete()
        .eq('id', photoId);
      
      if (dbError) throw dbError;
      
      // Get the deleted photo
      const deletedPhoto = photos.find(p => p.id === photoId);
      const wasPrimary = deletedPhoto?.is_primary || false;
      
      // Update local state
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      
      // Reorder remaining photos
      await updatePhotoOrder(updatedPhotos);
      
      // If we deleted the primary photo, set the first remaining photo as primary
      if (wasPrimary && updatedPhotos.length > 0) {
        await setPrimaryPhoto(updatedPhotos[0].id);
      } else {
        // Just refresh the photos
        await fetchPhotos();
      }
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
      return false;
    }
  };

  return { deletePhoto };
};
