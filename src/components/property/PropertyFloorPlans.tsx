
import React, { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/button";
import { Download, File } from "lucide-react";
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
  category?: string; // Make category optional since it might not exist in all documents
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
        
        // First try to get floor plans from property_documents table
        let { data: floorPlansData, error: floorPlansError } = await supabase
          .from("property_documents")
          .select("id, name, url, type, size, category")
          .eq("property_id", propertyId);
        
        logger.info(`Floor plans query result: ${floorPlansData?.length || 0} documents found`);
          
        if (floorPlansError) {
          logger.error("Error fetching floor plans:", floorPlansError);
          throw floorPlansError;
        }
        
        // Filter for floor plans - check name if category doesn't exist
        const filteredPlans = floorPlansData?.filter(doc => 
          (doc.category && doc.category.toLowerCase().includes('floor')) || 
          (doc.name && doc.name.toLowerCase().includes('floor')) ||
          (doc.name && doc.name.toLowerCase().includes('plan'))
        ) || [];
        
        if (filteredPlans.length > 0) {
          floorPlansData = filteredPlans;
        }
        
        if (floorPlansData && floorPlansData.length > 0) {
          // Validate URLs before setting the data
          const validatedPlans = floorPlansData.filter(plan => 
            plan && 
            plan.url && 
            typeof plan.url === 'string' && 
            plan.name && 
            typeof plan.name === 'string'
          );
          
          logger.info(`Valid floor plans: ${validatedPlans.length}`);
          setFloorPlans(validatedPlans);
        } else {
          setFloorPlans([]);
        }
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
    if (!floorPlan.url) {
      logger.error("Attempted to download floor plan with no URL:", floorPlan);
      return;
    }
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
