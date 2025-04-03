
import { DocumentMetadata } from "@/types/document";
import { useSupabase } from "@/hooks/useSupabase";

export function useFloorPlanUpdate() {
  const { supabase } = useSupabase();

  const updateFloorPlans = async (
    floorPlans: DocumentMetadata[], 
    propertyId: string, 
    userId: string
  ) => {
    try {
      if (floorPlans.length > 0) {
        for (const floorPlan of floorPlans) {
          if (!floorPlan.id || !floorPlan.id.includes('/')) continue;
          
          const documentData = {
            id: floorPlan.id.replace(/\//g, '_'),
            name: floorPlan.name,
            url: floorPlan.url,
            type: floorPlan.type,
            size: floorPlan.size,
            property_id: propertyId,
            uploaded_by: userId,
            document_type: "floor_plan",
            path: floorPlan.path,
            created_at: floorPlan.createdAt
          };

          const { data: existingDoc, error: checkError } = await supabase
            .from("property_documents")
            .select("id")
            .eq("property_id", propertyId)
            .eq("path", floorPlan.path)
            .maybeSingle();

          if (!checkError) {
            if (existingDoc) {
              await supabase
                .from("property_documents")
                .update(documentData)
                .eq("id", existingDoc.id);
            } else {
              await supabase
                .from("property_documents")
                .insert(documentData);
            }
          }
        }
      }
      return { success: true };
    } catch (documentError) {
      console.warn("Could not save to property_documents table:", documentError);
      return { success: false, error: documentError };
    }
  };

  return { updateFloorPlans };
}
