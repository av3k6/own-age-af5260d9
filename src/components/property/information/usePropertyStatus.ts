
import { useState } from "react";
import { PropertyListing, ListingStatus } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function usePropertyStatus(property: PropertyListing) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [status, setStatus] = useState<ListingStatus>(property.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const isOwner = user?.id === property.sellerId;

  // Function to toggle listing status
  const toggleListingStatus = async () => {
    if (!isOwner) return;
    
    setIsUpdating(true);
    const newStatus = status === ListingStatus.ACTIVE ? ListingStatus.PENDING : ListingStatus.ACTIVE;
    
    try {
      const { error } = await supabase
        .from("property_listings")
        .update({ status: newStatus })
        .eq("id", property.id)
        .eq("seller_id", user!.id);

      if (error) throw error;
      
      setStatus(newStatus);
      toast({
        title: "Status Updated",
        description: `Listing is now ${newStatus === ListingStatus.ACTIVE ? "active" : "pending"}.`,
      });
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update listing status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    status,
    isUpdating,
    isOwner,
    toggleListingStatus
  };
}
