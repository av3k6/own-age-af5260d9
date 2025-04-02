
import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Input } from "@/components/ui/input";
import { DocumentMetadata } from "@/types/document";
import { Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FloorPlanUploaderProps {
  floorPlans: DocumentMetadata[];
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void;
  propertyId?: string;
}

const FloorPlanUploader = ({ floorPlans, setFloorPlans, propertyId }: FloorPlanUploaderProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { supabase, safeUpload, safeGetPublicUrl } = useSupabase();
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

    try {
      for (const file of validFiles) {
        // Always use storage folder
        const folderPath = propertyId ? `floor_plans/${propertyId}` : `floor_plans/temp_${Date.now()}`;
        const filePath = `${folderPath}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        // Set intermediate progress
        setUploadProgress(30);

        // Use our safe upload function
        const { data, error } = await safeUpload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          console.error("Upload error details:", error);
          throw error;
        }

        // Get the public URL for the uploaded file using safe function
        const { data: urlData } = safeGetPublicUrl(filePath);

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
        
        // Simulate upload completed
        setUploadProgress(100);
      }

      toast({
        title: "Floor plan uploaded",
        description: "Your floor plan has been uploaded successfully.",
      });

    } catch (error: any) {
      console.error("Error uploading floor plan:", error);
      
      let errorMessage = "Failed to upload floor plan. Please try again.";
      
      if (error?.message?.includes("Bucket not found")) {
        errorMessage = "There was an issue with the storage system. Please try again later or contact support.";
      }
      
      setUploadError(errorMessage);
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
