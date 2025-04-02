
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface PropertyPhoto {
  id: string;
  url: string;
  display_order: number;
  is_primary: boolean;
}

export const usePhotoManagement = (propertyId: string | undefined) => {
  const { supabase, safeUpload, safeGetPublicUrl } = useSupabase();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch existing photos
  const fetchPhotos = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching photos for property:", propertyId);
      const { data, error } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.log('Property photos table may not exist:', error);
        setPhotos([]);
      } else {
        console.log("Fetched photos:", data?.length || 0);
        setPhotos(data || []);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      toast({
        title: "Error",
        description: "Failed to load property photos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const uploadPhotos = async (files: File[]) => {
    if (!files.length || !propertyId) {
      console.log("No files or propertyId provided");
      return false;
    }
    
    setIsUploading(true);
    let uploadSuccess = false;
    
    try {
      console.log("Starting upload for", files.length, "files for property:", propertyId);
      
      // Process each file
      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `property-photos/${propertyId}/${Date.now()}.${fileExt}`;
        
        console.log(`Uploading file: ${fileName}`);
        
        // Upload to Supabase Storage using the safe upload method
        const { data, error: uploadError } = await safeUpload(fileName, file);
        
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("File uploaded successfully, getting public URL");
        
        // Get public URL using the safe method
        const { data: urlData } = safeGetPublicUrl(fileName);
        if (!urlData?.publicUrl) {
          console.error("Failed to get public URL");
          throw new Error("Failed to get public URL for uploaded file");
        }
        
        console.log("Public URL obtained:", urlData.publicUrl);
        
        // Add to database with next display order
        const nextOrder = photos.length > 0 
          ? Math.max(...photos.map(p => p.display_order)) + 1 
          : 0;
        
        try {
          console.log("Inserting record into property_photos table");
          const { error: dbError } = await supabase
            .from('property_photos')
            .insert({
              property_id: propertyId,
              url: urlData.publicUrl,
              display_order: nextOrder,
              is_primary: photos.length === 0 // First photo is primary by default
            });
          
          if (dbError) {
            console.error('Database error:', dbError);
            // Show warning but continue
            toast({
              title: "Database Warning",
              description: "Photo uploaded but metadata could not be saved. The property_photos table may not exist.",
              variant: "destructive",
            });
          } else {
            console.log("Database record inserted successfully");
          }
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Show warning but continue
          toast({
            title: "Database Warning",
            description: "Photo uploaded but metadata could not be saved. The property_photos table may not exist.",
            variant: "destructive",
          });
        }
      }
      
      // Refresh photos
      await fetchPhotos();
      toast({
        title: "Success",
        description: `${files.length} photo(s) uploaded successfully`,
      });
      
      uploadSuccess = true;
      return true;
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload photos. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUploading(false);
      console.log("Upload process completed with success:", uploadSuccess);
    }
  };

  // Handle photo deletion
  const deletePhoto = async (photoId: string) => {
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
      setPhotos(updatedPhotos);
      
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
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  // Update photo order in the database
  const updatePhotoOrder = async (orderedPhotos: PropertyPhoto[]) => {
    if (!propertyId) return;
    
    try {
      for (let i = 0; i < orderedPhotos.length; i++) {
        await supabase
          .from('property_photos')
          .update({ display_order: i })
          .eq('id', orderedPhotos[i].id);
      }
    } catch (error) {
      console.error('Error updating photo order:', error);
      throw error;
    }
  };

  // Move photo up in the order
  const movePhotoUp = async (index: number) => {
    if (index <= 0) return;
    
    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[index - 1];
    newPhotos[index - 1] = temp;
    
    // Update display order properties
    newPhotos[index].display_order = index;
    newPhotos[index - 1].display_order = index - 1;
    
    // Update UI immediately
    setPhotos(newPhotos);
    
    // Update in database
    try {
      await updatePhotoOrder(newPhotos);
    } catch (error) {
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to update photo order",
        variant: "destructive",
      });
      fetchPhotos();
    }
  };

  // Move photo down in the order
  const movePhotoDown = async (index: number) => {
    if (index >= photos.length - 1) return;
    
    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[index + 1];
    newPhotos[index + 1] = temp;
    
    // Update display order properties
    newPhotos[index].display_order = index;
    newPhotos[index + 1].display_order = index + 1;
    
    // Update UI immediately
    setPhotos(newPhotos);
    
    // Update in database
    try {
      await updatePhotoOrder(newPhotos);
    } catch (error) {
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to update photo order",
        variant: "destructive",
      });
      fetchPhotos();
    }
  };

  // Set photo as primary
  const setPrimaryPhoto = async (photoId: string) => {
    if (!propertyId) return;
    
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
      
      // Refresh photos
      await fetchPhotos();
      
      toast({
        title: "Success",
        description: "Primary photo updated",
      });
    } catch (error) {
      console.error('Error setting primary photo:', error);
      toast({
        title: "Error",
        description: "Failed to update primary photo",
        variant: "destructive",
      });
    }
  };

  // Initialize
  useEffect(() => {
    if (propertyId) {
      fetchPhotos();
    }
  }, [propertyId]);

  return {
    photos,
    isLoading,
    isUploading,
    fetchPhotos,
    uploadPhotos,
    deletePhoto,
    movePhotoUp,
    movePhotoDown,
    setPrimaryPhoto
  };
};

export type { PropertyPhoto };
