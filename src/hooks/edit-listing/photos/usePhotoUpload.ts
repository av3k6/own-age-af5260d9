import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PhotoUploadResult } from "./types";
import { createLogger } from "@/utils/logger";

const logger = createLogger("usePhotoUpload");

export const usePhotoUpload = (propertyId: string | undefined) => {
  const { supabase, safeUpload, safeGetPublicUrl } = useSupabase();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Create property_photos table if it doesn't exist
  const ensurePropertyPhotosTable = async (): Promise<boolean> => {
    try {
      logger.info("Ensuring property_photos table exists");
      
      // Try a simple query to see if the table exists and is accessible
      const { error } = await supabase
        .from('property_photos')
        .select('count')
        .limit(1);
      
      // If the table doesn't exist, try to create it
      if (error && (error.code === '42P01' || error.message.includes('relation "property_photos" does not exist'))) {
        logger.warn("property_photos table doesn't exist, creating it...");
        
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS property_photos (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            property_id UUID NOT NULL,
            url TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            is_primary BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_property_photos_property_id 
          ON property_photos(property_id);
          
          CREATE INDEX IF NOT EXISTS idx_property_photos_display_order 
          ON property_photos(display_order);
        `;
        
        // Try to create the table using RPC
        try {
          const { error: createError } = await supabase.rpc('create_table_if_not_exists', { 
            table_sql: createTableSQL 
          });
          
          if (createError) {
            logger.error("Failed to create property_photos table:", createError);
            return false;
          }
          
          logger.info("Successfully created property_photos table");
          return true;
        } catch (rpcError) {
          logger.error("RPC error creating table:", rpcError);
          return false;
        }
      } else if (error) {
        logger.error("Error checking property_photos table:", error);
        return false;
      }
      
      // If we get here, the table exists
      logger.info("property_photos table exists");
      return true;
    } catch (error) {
      logger.error("Error in ensurePropertyPhotosTable:", error);
      return false;
    }
  };

  const uploadPhotos = async (files: File[], currentPhotosLength: number): Promise<PhotoUploadResult> => {
    if (!files.length || !propertyId) {
      logger.info("No files or propertyId provided");
      return { success: false };
    }
    
    setIsUploading(true);
    let uploadSuccess = false;
    const uploadedFiles: File[] = [];
    
    try {
      logger.info("Starting upload for", files.length, "files for property:", propertyId);
      
      // First ensure the property_photos table exists
      const tableExists = await ensurePropertyPhotosTable();
      if (!tableExists) {
        logger.error("property_photos table could not be created or accessed");
        toast({
          title: "Database Error",
          description: "Could not prepare the database for photo uploads. Your permissions may be limited.",
          variant: "destructive",
        });
        return { success: false, error: "Database table error" };
      }
      
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          // Validate file type
          const fileType = file.type.toLowerCase();
          const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
          if (!validTypes.includes(fileType)) {
            toast({
              title: "Invalid File Type",
              description: `File ${file.name} is not a supported image type. Only JPG, PNG, and WebP are accepted.`,
              variant: "destructive",
            });
            continue;
          }
          
          // Validate file size (5MB limit)
          const MAX_SIZE = 5 * 1024 * 1024; // 5MB
          if (file.size > MAX_SIZE) {
            toast({
              title: "File Too Large",
              description: `File ${file.name} exceeds the 5MB limit.`,
              variant: "destructive",
            });
            continue;
          }
          
          // Create a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `property-photos/${propertyId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          logger.info(`Uploading file: ${fileName}`);
          
          // Upload to Supabase Storage
          const { data, error: uploadError } = await supabase.storage
            .from('property-photos')
            .upload(fileName, file, {
              cacheControl: '3600',
              contentType: file.type,
            });
          
          if (uploadError) {
            logger.error("Storage upload error:", uploadError);
            throw uploadError;
          }
          
          // Mark file as uploaded for counting
          uploadedFiles.push(file);
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('property-photos')
            .getPublicUrl(fileName);
          
          if (!urlData?.publicUrl) {
            logger.error("Failed to get public URL");
            throw new Error("Failed to get public URL for uploaded file");
          }
          
          logger.info("Public URL obtained:", urlData.publicUrl);
          
          // Add to database with next display order
          const nextOrder = currentPhotosLength + i;
          const isPrimary = currentPhotosLength === 0 && i === 0; // First photo is primary by default
          
          const { error: dbError } = await supabase
            .from('property_photos')
            .insert({
              property_id: propertyId,
              url: urlData.publicUrl,
              display_order: nextOrder,
              is_primary: isPrimary
            });
          
          if (dbError) {
            logger.error('Database error adding photo record:', dbError);
            throw dbError;
          }
          
          logger.info(`Successfully uploaded photo ${i+1} with order ${nextOrder}`);
        } catch (fileError) {
          logger.error(`Error processing file ${file.name}:`, fileError);
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}. Please try again.`,
            variant: "destructive",
          });
        }
      }
      
      // If we've uploaded at least one file, consider it a success
      if (uploadedFiles.length > 0) {
        uploadSuccess = true;
        
        toast({
          title: "Success",
          description: `${uploadedFiles.length} photo${uploadedFiles.length === 1 ? '' : 's'} uploaded successfully`,
        });
      } else {
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
      logger.error('Error in photo upload process:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return { success: false, error: String(error) };
    } finally {
      setIsUploading(false);
      logger.info("Upload process completed with success:", uploadSuccess);
    }
  };

  return { isUploading, uploadPhotos };
};
