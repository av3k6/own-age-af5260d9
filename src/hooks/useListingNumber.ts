
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface UseListingNumberReturn {
  formatListingNumber: (listingNumber?: string, listingStatus?: string) => string;
  isLoading: boolean;
}

export const useListingNumber = (): UseListingNumberReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  /**
   * Formats a listing number for display based on status
   * For pending listings, replaces TH prefix with 'TH'
   */
  const formatListingNumber = (listingNumber?: string, listingStatus?: string): string => {
    if (!listingNumber) return 'TH########';
    
    const isPending = listingStatus?.toLowerCase() === 'pending';
    
    if (isPending) {
      return 'TH' + (listingNumber.substring(2) || '########');
    } 
    
    return listingNumber;
  };

  return {
    formatListingNumber,
    isLoading
  };
};
