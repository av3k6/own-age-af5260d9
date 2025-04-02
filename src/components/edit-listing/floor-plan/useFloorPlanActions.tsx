
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { DocumentMetadata } from "@/types/document";

export const useFloorPlanActions = (
  floorPlans: DocumentMetadata[],
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void
) => {
  const { toast } = useToast();
  const { supabase } = useSupabase();

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

  return {
    handleDelete,
    handleDownload
  };
};
