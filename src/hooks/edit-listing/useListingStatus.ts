
import { useState, useEffect } from "react";
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
  
  // Modified this function to implement the correct status change logic
  const isStatusChangeAllowed = (currentStatus: string | null, newStatus: string) => {
    // If the currentStatus is not expired, allow change to any status
    // If the currentStatus is expired, only admin can change it (handled elsewhere)
    return currentStatus !== ListingStatus.EXPIRED;
  };

  // Get status on initial load
  useEffect(() => {
    if (propertyId && !originalStatus) {
      getOriginalStatus();
    }
  }, [propertyId]);

  return {
    originalStatus,
    getOriginalStatus,
    isStatusChangeAllowed
  };
}
