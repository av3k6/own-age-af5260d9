
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploadResult } from "./types";

export const usePhotoUpload = (propertyId: string | undefined) => {
  const { supabase, safeUpload, safeGetPublicUrl } = useSupabase();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhotos = async (files: File[], currentPhotosLength: number): Promise<PhotoUploadResult> => {
    if (!files.length || !propertyId) {
      console.log("usePhotoUpload: No files or propertyId provided");
      return { success: false };
    }
    
    setIsUploading(true);
    let uploadSuccess = false;
    const uploadedFiles: File[] = [];
    
    try {
      console.log("Starting upload for", files.length, "files for property:", propertyId);
      
      // Process each file
      for (const file of files) {
        try {
          // Create a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `property-photos/${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          console.log(`Uploading file: ${fileName}`);
          
          // Upload to Supabase Storage using the safe upload method
          const { data, error: uploadError } = await safeUpload(fileName, file);
          
          if (uploadError) {
            console.error("Storage upload error:", uploadError);
            throw uploadError;
          }
          
          uploadedFiles.push(file);
          console.log("File uploaded successfully, getting public URL");
          
          // Get public URL using the safe method
          const { data: urlData } = safeGetPublicUrl(fileName);
          if (!urlData?.publicUrl) {
            console.error("Failed to get public URL");
            throw new Error("Failed to get public URL for uploaded file");
          }
          
          console.log("Public URL obtained:", urlData.publicUrl);
          
          // Add to database with next display order
          const nextOrder = currentPhotosLength + uploadedFiles.length - 1;
          
          try {
            console.log("Inserting record into property_photos table");
            const { error: dbError } = await supabase
              .from('property_photos')
              .insert({
                property_id: propertyId,
                url: urlData.publicUrl,
                display_order: nextOrder,
                is_primary: currentPhotosLength === 0 && uploadedFiles.length === 1 // First photo is primary by default
              });
            
            if (dbError) {
              console.error('Database error:', dbError);
              toast({
                title: "Database Warning",
                description: "Photo uploaded but metadata could not be saved. The property_photos table may not exist.",
                variant: "default",
              });
            } else {
              console.log("Database record inserted successfully");
            }
          } catch (dbError) {
            console.error('Error saving to database:', dbError);
            toast({
              title: "Database Warning",
              description: "Photo uploaded but metadata could not be saved. The property_photos table may not exist.",
              variant: "default",
            });
          }
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
          toast({
            title: "Upload Error",
            description: `Failed to upload file ${file.name}. Please try again.`,
            variant: "destructive",
          });
          // Continue with next file
        }
      }
      
      // If we've made it here, at least some files uploaded successfully
      if (uploadedFiles.length > 0) {
        uploadSuccess = true;
        
        if (uploadSuccess) {
          toast({
            title: "Success",
            description: `${uploadedFiles.length} photo(s) uploaded successfully`,
          });
        }
      } else if (files.length > 0 && uploadedFiles.length === 0) {
        toast({
          title: "Upload Failed",
          description: "None of the photos could be uploaded. Please try again.",
          variant: "destructive",
        });
      }
      
      return { 
        success: uploadSuccess,
        uploadedFiles 
      };
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error",
        description: "Failed to upload photos. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: String(error) };
    } finally {
      setIsUploading(false);
      console.log("Upload process completed with success:", uploadSuccess);
    }
  };

  return { isUploading, uploadPhotos };
};
