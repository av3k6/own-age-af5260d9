
import { DocumentMetadata } from "@/types/document";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger("useFloorPlanUpdate");

export function useFloorPlanUpdate() {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const updateFloorPlans = async (
    floorPlans: DocumentMetadata[], 
    propertyId: string, 
    userId: string
  ) => {
    try {
      logger.info(`Updating ${floorPlans.length} floor plans for property ${propertyId}`);
      
      if (floorPlans.length > 0) {
        for (const floorPlan of floorPlans) {
          // Generate a valid UUID for document ID instead of using the filename
          const documentId = uuidv4();
          
          const documentData = {
            id: documentId,
            name: floorPlan.name,
            url: floorPlan.url,
            type: floorPlan.type,
            size: floorPlan.size,
            property_id: propertyId,
            uploaded_by: userId,
            category: 'floor_plans',
            path: floorPlan.path,
            created_at: floorPlan.createdAt || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          logger.info(`Checking if floor plan already exists: ${floorPlan.name}`);
          const { data: existingDoc, error: checkError } = await supabase
            .from("property_documents")
            .select("id")
            .eq("property_id", propertyId)
            .eq("path", floorPlan.path)
            .maybeSingle();

          if (checkError) {
            logger.error("Error checking existing document:", checkError);
            continue;
          }

          let result;
          if (existingDoc) {
            logger.info(`Updating existing floor plan: ${existingDoc.id}`);
            result = await supabase
              .from("property_documents")
              .update(documentData)
              .eq("id", existingDoc.id);
          } else {
            logger.info(`Inserting new floor plan: ${documentId}`);
            result = await supabase
              .from("property_documents")
              .insert(documentData);
          }
          
          if (result?.error) {
            logger.error("Error saving floor plan document:", result.error);
            toast({
              title: "Error saving floor plan",
              description: `Could not save ${floorPlan.name} to the database`,
              variant: "destructive",
            });
          } else {
            logger.info(`Successfully saved floor plan: ${floorPlan.name}`);
          }
        }
      }
      return { success: true };
    } catch (documentError) {
      logger.error("Could not save floor plans:", documentError);
      toast({
        title: "Error saving floor plans",
        description: "Some floor plans could not be saved. Please try again.",
        variant: "destructive",
      });
      return { success: false, error: documentError };
    }
  };

  return { updateFloorPlans };
}
