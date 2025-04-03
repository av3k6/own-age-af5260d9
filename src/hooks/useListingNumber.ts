
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
    if (!listingNumber || listingNumber.trim() === '') return 'TH########';
    
    // Always return the actual listing number regardless of status
    return listingNumber;
  };

  /**
   * Generates a unique listing number
   * Format: TH + 8 random digits
   * If a propertyId is provided, it will use part of that for uniqueness
   */
  const generateListingNumber = async (propertyId?: string): Promise<string> => {
    setIsLoading(true);
    try {
      let uniqueDigits: string;
      
      // If we have a property ID, extract some digits from it for uniqueness
      if (propertyId) {
        // Remove hyphens and take the last 8 characters of the UUID
        const idDigits = propertyId.replace(/-/g, '').slice(-8);
        uniqueDigits = idDigits;
      } else {
        // Generate 8 random digits
        uniqueDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
      }
      
      // Ensure we have exactly 8 digits
      if (uniqueDigits.length > 8) {
        uniqueDigits = uniqueDigits.substring(0, 8);
      } else if (uniqueDigits.length < 8) {
        // Pad with random digits if needed
        const padding = Math.random().toString().substring(2, 10 - uniqueDigits.length);
        uniqueDigits = uniqueDigits + padding;
      }
      
      const listingNumber = `TH${uniqueDigits}`;
      
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
      // Fallback to timestamp-based listing number
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
