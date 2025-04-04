
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
        
        // Try first with more specific query for property_documents table with "floor_plans" category
        let { data: floorPlansData, error: floorPlansError } = await supabase
          .from("property_documents")
          .select("id, name, url, type, size")
          .eq("property_id", propertyId)
          .eq("category", "floor_plans");
        
        logger.info(`Floor plans query result (plural): ${floorPlansData?.length || 0} documents found, error: ${floorPlansError?.message || 'none'}`);
          
        // If no data, try alternative query with category "floor_plan" (singular)
        if (!floorPlansData || floorPlansData.length === 0) {
          logger.info("No data with 'floor_plans', trying with 'floor_plan' (singular)");
          const { data: altData, error: altError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId)
            .eq("category", "floor_plan");
          
          logger.info(`Floor plans query result (singular): ${altData?.length || 0} documents found, error: ${altError?.message || 'none'}`);
            
          if (!altError && altData && altData.length > 0) {
            floorPlansData = altData;
            floorPlansError = null;
          }
        }
        
        // Try with document_type field as fallback
        if (!floorPlansData || floorPlansData.length === 0) {
          logger.info("No data with categories, trying with document_type field");
          const { data: typeData, error: typeError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId)
            .eq("document_type", "floor_plan");
          
          logger.info(`Floor plans query result (document_type): ${typeData?.length || 0} documents found, error: ${typeError?.message || 'none'}`);
            
          if (!typeError && typeData && typeData.length > 0) {
            floorPlansData = typeData;
            floorPlansError = null;
          }
        }
        
        // Fallback to any documents with "floor" or "plan" in their name
        if (!floorPlansData || floorPlansData.length === 0) {
          logger.info("No floor plans found with specific categories, checking for any documents");
          const { data: anyDocsData, error: anyDocsError } = await supabase
            .from("property_documents")
            .select("id, name, url, type, size")
            .eq("property_id", propertyId);
          
          logger.info(`Any documents query result: ${anyDocsData?.length || 0} documents found, error: ${anyDocsError?.message || 'none'}`);
            
          if (!anyDocsError && anyDocsData && anyDocsData.length > 0) {
            // Filter for file names that might be floor plans
            floorPlansData = anyDocsData.filter(doc => 
              doc.name.toLowerCase().includes('floor') || 
              doc.name.toLowerCase().includes('plan')
            );
            
            logger.info(`After filtering for floor plans: ${floorPlansData?.length || 0} documents found`);
          }
        }
        
        // Fallback to try the property_listings.documents field if it's an array
        if (!floorPlansData || floorPlansData.length === 0) {
          logger.info("Checking property_listings.documents field as a last resort");
          const { data: listingData, error: listingError } = await supabase
            .from("property_listings")
            .select("documents")
            .eq("id", propertyId)
            .single();
          
          if (!listingError && listingData && Array.isArray(listingData.documents) && listingData.documents.length > 0) {
            // Filter documents that might be floor plans
            const possibleFloorPlans = listingData.documents.filter((doc: any) => {
              if (!doc || typeof doc !== 'object') return false;
              
              const nameMatch = doc.name && typeof doc.name === 'string' && (
                doc.name.toLowerCase().includes('floor') || 
                doc.name.toLowerCase().includes('plan')
              );
              
              const categoryMatch = doc.category && typeof doc.category === 'string' && (
                doc.category.toLowerCase() === 'floor_plan' || 
                doc.category.toLowerCase() === 'floor_plans'
              );
              
              return nameMatch || categoryMatch;
            });
            
            if (possibleFloorPlans.length > 0) {
              floorPlansData = possibleFloorPlans;
              logger.info(`Found ${possibleFloorPlans.length} floor plans in property_listings.documents`);
            }
          }
        }
        
        logger.info(`Final floor plans count: ${floorPlansData?.length || 0}`);
        
        if (floorPlansData && floorPlansData.length > 0) {
          // Validate URLs before setting the data
          const validatedPlans = floorPlansData.filter(plan => 
            plan && 
            plan.url && 
            typeof plan.url === 'string' && 
            plan.name && 
            typeof plan.name === 'string'
          );
          
          logger.info(`After validation: ${validatedPlans.length} floor plans with valid URLs`);
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
