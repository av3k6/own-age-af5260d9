
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface UseListingNumberReturn {
  formatListingNumber: (listingNumber?: string, listingStatus?: string) => string;
  generateListingNumber: () => Promise<string>;
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

  /**
   * Generates a unique listing number
   * Format: TH + 8 random digits
   */
  const generateListingNumber = async (): Promise<string> => {
    setIsLoading(true);
    try {
      // Generate random 8-digit number
      const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
      const listingNumber = `TH${randomDigits}`;
      
      // Check if this number already exists in the database to ensure uniqueness
      const { data, error } = await supabase
        .from('property_listings')
        .select('id')
        .eq('listing_number', listingNumber)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking listing number:', error);
      }
      
      // If the number already exists, generate a new one recursively
      if (data) {
        return generateListingNumber();
      }
      
      return listingNumber;
    } catch (error) {
      console.error('Error generating listing number:', error);
      return `TH${Date.now().toString().substring(3, 11)}`;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formatListingNumber,
    generateListingNumber,
    isLoading
  };
};
