
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { ListingStatus } from "@/types";

export function useListingStatus(propertyId: string | undefined) {
  const { supabase } = useSupabase();
  const [originalStatus, setOriginalStatus] = useState<string | null>(null);
  
  const getOriginalStatus = async () => {
    if (!propertyId || originalStatus) return originalStatus;
    
    try {
      const { data, error } = await supabase
        .from("property_listings")
        .select("status")
        .eq("id", propertyId)
        .single();
        
      if (error) throw error;
      
      setOriginalStatus(data.status);
      return data.status;
    } catch (error) {
      console.error("Error fetching original status:", error);
      return null;
    }
  };
  
  const isStatusChangeAllowed = (originalStatus: string | null, newStatus: string) => {
    // Check if the status is locked - only if trying to change FROM expired TO something else
    // We want to allow changing TO expired from any other status
    return !(originalStatus === ListingStatus.EXPIRED && 
             newStatus !== ListingStatus.EXPIRED);
  };

  return {
    originalStatus,
    getOriginalStatus,
    isStatusChangeAllowed
  };
}
