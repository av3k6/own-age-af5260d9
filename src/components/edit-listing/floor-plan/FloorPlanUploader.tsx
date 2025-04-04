
import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Input } from "@/components/ui/input";
import { DocumentMetadata } from "@/types/document";
import { Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createLogger } from "@/utils/logger";

const logger = createLogger("FloorPlanUploader");

interface FloorPlanUploaderProps {
  floorPlans: DocumentMetadata[];
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void;
  propertyId?: string;
}

const FloorPlanUploader = ({ floorPlans, setFloorPlans, propertyId }: FloorPlanUploaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { safeUpload, safeGetPublicUrl } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/jpg',
      'application/octet-stream', // For DWG/DXF files
      'application/acad', // AutoCAD
      'application/dxf', // DXF
      'application/dwg' // DWG
    ];

    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type) || 
                         file.name.endsWith('.dwg') || 
                         file.name.endsWith('.dxf');
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported floor plan format.`,
          variant: "destructive"
        });
      }
      
      return isValidType;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const file of validFiles) {
        // Set folder path based on property ID
        const folderPath = propertyId 
          ? `floor_plans/${propertyId}` 
          : `floor_plans/temp_${Date.now()}`;
          
        const filePath = `${folderPath}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Set intermediate progress
        setUploadProgress(30);
        logger.info(`Uploading floor plan: ${filePath}`);

        try {
          // Use our enhanced upload function with fallback
          const { data, error } = await safeUpload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
  
          if (error) {
            logger.error("Floor plan upload error:", error);
            throw error;
          }
  
          logger.info("Floor plan uploaded successfully:", data);
          
          // Get the public URL using the enhanced function
          const { data: urlData } = safeGetPublicUrl(filePath);
          
          if (!urlData.publicUrl) {
            throw new Error("Failed to get public URL for the uploaded file");
          }
  
          // Create metadata for the new floor plan
          const newFloorPlan: DocumentMetadata = {
            id: data.path || `${Date.now()}-${file.name}`,
            name: file.name,
            type: file.type,
            size: file.size,
            url: urlData.publicUrl,
            path: filePath,
            uploadedBy: user?.id || '',
            createdAt: new Date().toISOString(),
            propertyId: propertyId
          };
  
          // Add the new floor plan to the list
          setFloorPlans([...floorPlans, newFloorPlan]);
          successCount++;
          
        } catch (uploadError: any) {
          logger.error(`Error uploading ${file.name}:`, uploadError);
          errorCount++;
          
          toast({
            title: "Upload failed",
            description: `Failed to upload ${file.name}. ${uploadError.message || ''}`,
            variant: "destructive"
          });
        }
      }

      if (successCount > 0) {
        toast({
          title: `${successCount} floor plan${successCount > 1 ? 's' : ''} uploaded`,
          description: errorCount > 0 
            ? `${errorCount} file${errorCount > 1 ? 's' : ''} failed to upload.` 
            : "All floor plans uploaded successfully.",
          variant: errorCount > 0 ? "default" : "default"
        });
      }

      // Simulate upload completed for UI
      setUploadProgress(100);
    } catch (error: any) {
      logger.error("Unexpected error in floor plan upload:", error);
      
      setUploadError("There was a problem with the upload. Please try again.");
      
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your floor plans. Please try again later.",
        variant: "destructive"
      });
    } finally {
      // Small delay to show 100% before resetting
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 800);
    }
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      <div 
        className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h4 className="font-medium">Upload Floor Plans</h4>
        <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
          onChange={handleFileChange}
          multiple
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center">Uploading: {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

export default FloorPlanUploader;
