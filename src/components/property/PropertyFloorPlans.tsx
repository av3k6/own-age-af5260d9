
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
        
        // Try multiple approaches to find floor plans
        const fetchStrategies = [
          // Strategy 1: Standard query with floor_plans category
          async () => {
            logger.info("Strategy 1: Querying floor_plans category");
            const { data, error } = await supabase
              .from("property_documents")
              .select("id, name, url, type, size")
              .eq("property_id", propertyId)
              .eq("category", "floor_plans");
              
            if (error) throw error;
            return data || [];
          },
          
          // Strategy 2: Try singular floor_plan category
          async () => {
            logger.info("Strategy 2: Querying floor_plan category (singular)");
            const { data, error } = await supabase
              .from("property_documents")
              .select("id, name, url, type, size")
              .eq("property_id", propertyId)
              .eq("category", "floor_plan");
              
            if (error) throw error;
            return data || [];
          },
          
          // Strategy 3: Try document_type field
          async () => {
            logger.info("Strategy 3: Querying by document_type");
            const { data, error } = await supabase
              .from("property_documents")
              .select("id, name, url, type, size")
              .eq("property_id", propertyId)
              .eq("document_type", "floor_plan");
              
            if (error) throw error;
            return data || [];
          },
          
          // Strategy 4: Get all documents and filter by name
          async () => {
            logger.info("Strategy 4: Getting all documents and filtering by name");
            const { data, error } = await supabase
              .from("property_documents")
              .select("id, name, url, type, size")
              .eq("property_id", propertyId);
              
            if (error) throw error;
            
            // Filter for likely floor plan documents based on name
            return (data || []).filter(doc => 
              doc.name.toLowerCase().includes('floor') || 
              doc.name.toLowerCase().includes('plan')
            );
          }
        ];
        
        // Try each strategy until we find floor plans
        let foundPlans: any[] = [];
        
        for (const strategy of fetchStrategies) {
          try {
            foundPlans = await strategy();
            logger.info(`Strategy found ${foundPlans.length} floor plans`);
            
            if (foundPlans.length > 0) {
              break; // Stop if we found plans
            }
          } catch (strategyError) {
            logger.error("Strategy error:", strategyError);
            // Continue to next strategy
          }
        }
        
        // If we still have no plans, try a direct public query without RLS filtering
        // This handles the case where the floor plans are public but not accessible due to RLS
        if (foundPlans.length === 0) {
          logger.info("Trying direct fetch for publicly available floor plans");
          
          const { data: directData } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId)
            .is("category", null); // Try records without a specific category
            
          if (directData && directData.length > 0) {
            const possiblePlans = directData.filter(doc => 
              doc.name.toLowerCase().includes('floor') || 
              doc.name.toLowerCase().includes('plan')
            );
            
            if (possiblePlans.length > 0) {
              logger.info(`Found ${possiblePlans.length} potential floor plans through direct query`);
              foundPlans = possiblePlans;
            }
          }
        }
        
        logger.info(`Final result: Found ${foundPlans.length} floor plans`);
        setFloorPlans(foundPlans);
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
