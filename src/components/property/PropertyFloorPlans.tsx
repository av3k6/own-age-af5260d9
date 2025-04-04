
import React, { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { FileIcon, Download, File } from "lucide-react";
import { formatFileSize, getFileIconColor } from "@/utils/fileUtils"; 
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PropertyFloorPlans");

interface PropertyFloorPlansProps {
  propertyId: string;
}

interface FloorPlanDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

const PropertyFloorPlans: React.FC<PropertyFloorPlansProps> = ({ propertyId }) => {
  const { supabase } = useSupabase();
  const [floorPlans, setFloorPlans] = useState<FloorPlanDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!propertyId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        logger.info("Fetching floor plans for property:", propertyId);
        
        // Try first with floor_plans category
        let { data: floorPlansData, error: floorPlansError } = await supabase
          .from("property_documents")
          .select("id, name, url, type, size")
          .eq("property_id", propertyId)
          .eq("category", "floor_plans");
          
        // If no data or error, try alternative query with category "floor_plan" (singular)
        if ((!floorPlansData || floorPlansData.length === 0) && floorPlansError) {
          logger.info("Trying alternative query with category floor_plan (singular)");
          const { data: altData, error: altError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId)
            .eq("category", "floor_plan");
            
          if (!altError && altData && altData.length > 0) {
            floorPlansData = altData;
            floorPlansError = null;
          }
        }
        
        // If still no data, try with document_type field as fallback
        if ((!floorPlansData || floorPlansData.length === 0) && floorPlansError) {
          logger.info("Trying with document_type field as fallback");
          const { data: typeData, error: typeError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId)
            .eq("document_type", "floor_plan");
            
          if (!typeError && typeData && typeData.length > 0) {
            floorPlansData = typeData;
            floorPlansError = null;
          }
        }
        
        // Final attempt - check if documents exist for this property without filtering by type
        if ((!floorPlansData || floorPlansData.length === 0) && floorPlansError) {
          logger.info("Checking for any documents for this property");
          const { data: anyDocsData, error: anyDocsError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId);
            
          if (!anyDocsError && anyDocsData && anyDocsData.length > 0) {
            logger.info(`Found ${anyDocsData.length} documents, filtering for floor plans`);
            // Filter for file names that might be floor plans
            floorPlansData = anyDocsData.filter(doc => 
              doc.name.toLowerCase().includes('floor') || 
              doc.name.toLowerCase().includes('plan')
            );
          }
        }
        
        logger.info(`Found ${floorPlansData?.length || 0} floor plans`);
        setFloorPlans(floorPlansData || []);
      } catch (err: any) {
        logger.error("Error fetching floor plans:", err);
        setError("Could not load floor plans. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFloorPlans();
  }, [propertyId, supabase]);

  // Handle document download
  const handleDownload = (floorPlan: FloorPlanDocument) => {
    window.open(floorPlan.url, '_blank');
  };
  
  // Get appropriate file icon based on file type
  const getFileIcon = (fileName: string) => {
    const colorClass = getFileIconColor(fileName);
    return <File className={`h-8 w-8 ${colorClass}`} />;
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading floor plans...</p>;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (floorPlans.length === 0) {
    return <p className="text-sm text-muted-foreground">No floor plans available for this property</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Floor Plans</h3>
      <div className="grid grid-cols-1 gap-3">
        {floorPlans.map((floorPlan) => (
          <div 
            key={floorPlan.id}
            className="flex items-center justify-between p-3 bg-card border rounded-md hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {getFileIcon(floorPlan.name)}
              <div>
                <p className="font-medium">{floorPlan.name}</p>
                {floorPlan.size && (
                  <p className="text-xs text-muted-foreground">{formatFileSize(floorPlan.size)}</p>
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDownload(floorPlan)}
            >
              <Download className="h-4 w-4 mr-1" />
              <span>Download</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyFloorPlans;
