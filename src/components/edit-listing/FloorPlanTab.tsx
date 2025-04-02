
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DocumentMetadata } from "@/types/document";
import { File, Upload, X, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FloorPlanTabProps {
  floorPlans: DocumentMetadata[];
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void;
  propertyId?: string;
}

const FloorPlanTab = ({ floorPlans, setFloorPlans, propertyId }: FloorPlanTabProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { supabase, buckets, safeUpload, safeGetPublicUrl } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'dwg':
      case 'dxf':
        return <File className="h-10 w-10 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="h-10 w-10 text-green-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

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

  // Handle floor plan deletion
  const handleDelete = async (floorPlan: DocumentMetadata) => {
    try {
      // Always use storage bucket
      const { error } = await supabase.storage
        .from('storage')
        .remove([floorPlan.path]);

      if (error) throw error;

      // Remove from local state
      setFloorPlans(floorPlans.filter(fp => fp.id !== floorPlan.id));
      
      toast({
        title: "Floor plan removed",
        description: "The floor plan has been removed successfully.",
      });
    } catch (error: any) {
      console.error("Error removing floor plan:", error);
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove floor plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle floor plan download
  const handleDownload = (floorPlan: DocumentMetadata) => {
    const link = document.createElement('a');
    link.href = floorPlan.url;
    link.download = floorPlan.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Property Floor Plans</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload floor plans in PDF, JPG, PNG, DWG, or DXF format. Buyers will be able to download these documents.
        </p>

        {uploadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
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

          {floorPlans.length > 0 ? (
            <div className="space-y-4 mt-6">
              <Label>Uploaded Floor Plans</Label>
              <div className="space-y-2">
                {floorPlans.map((floorPlan) => (
                  <div key={floorPlan.id} className="flex items-center justify-between p-3 border rounded-md group">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(floorPlan.name)}
                      <div>
                        <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{floorPlan.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(floorPlan.size)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownload(floorPlan)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDelete(floorPlan)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground text-center mt-4">
              No floor plans uploaded yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloorPlanTab;
