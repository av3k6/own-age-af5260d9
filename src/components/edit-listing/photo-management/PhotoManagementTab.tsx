
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash2, ImageIcon } from "lucide-react";
import { FileUploader } from "@/components/ui/file-uploader";
import { formatFileSize } from "@/utils/fileUtils";

interface PropertyPhoto {
  id: string;
  url: string;
  display_order: number;
  is_primary: boolean;
}

interface PhotoManagementTabProps {
  propertyId: string | undefined;
}

export default function PhotoManagementTab({ propertyId }: PhotoManagementTabProps) {
  const { supabase, safeUpload, safeGetPublicUrl } = useSupabase();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Fetch existing photos
  const fetchPhotos = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', propertyId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setPhotos(data || []);
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

  useEffect(() => {
    if (propertyId) {
      fetchPhotos();
    }
  }, [propertyId]);

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    if (!files.length || !propertyId) return;
    
    setIsUploading(true);
    try {
      // Process each file
      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `property-photos/${propertyId}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error: uploadError } = await safeUpload(fileName, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = safeGetPublicUrl(fileName);
        
        // Add to database with next display order
        const nextOrder = photos.length > 0 
          ? Math.max(...photos.map(p => p.display_order)) + 1 
          : 0;
        
        const { error: dbError } = await supabase
          .from('property_photos')
          .insert({
            property_id: propertyId,
            url: urlData.publicUrl,
            display_order: nextOrder,
            is_primary: photos.length === 0 // First photo is primary by default
          });
        
        if (dbError) throw dbError;
      }
      
      // Refresh photos
      await fetchPhotos();
      setShowUploader(false);
      toast({
        title: "Success",
        description: `${files.length} photo(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (photoId: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Property Photos</h2>
          <p className="text-muted-foreground">
            Add, remove, or reorder photos of your property
          </p>
        </div>
        <Button onClick={() => setShowUploader(!showUploader)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Photos
        </Button>
      </div>

      {showUploader && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Upload New Photos</h3>
          <FileUploader
            accept="image/*"
            multiple
            maxFiles={10}
            maxSize={5 * 1024 * 1024} // 5MB
            onUpload={handleFileUpload}
            isUploading={isUploading}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Supported formats: JPG, PNG, WebP. Max size: 5MB per image.
          </p>
        </Card>
      )}

      {photos.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-md">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No photos added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`flex items-center p-3 bg-card border rounded-md ${
                photo.is_primary ? 'border-primary' : ''
              }`}
            >
              <div className="h-16 w-16 mr-4 overflow-hidden rounded-md">
                <img
                  src={photo.url}
                  alt={`Property photo ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Photo {index + 1}
                  {photo.is_primary && (
                    <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-1">
                {!photo.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrimaryPhoto(photo.id)}
                    title="Set as primary photo"
                  >
                    Set Primary
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => movePhotoUp(index)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m18 15-6-6-6 6"/>
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => movePhotoDown(index)}
                  disabled={index === photos.length - 1}
                  title="Move down"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="text-destructive"
                  title="Delete photo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
