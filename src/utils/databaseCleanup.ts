
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { createLogger } from '@/utils/logger';

const logger = createLogger('databaseCleanup');

/**
 * Clears all property listings from the Supabase database
 * This is primarily for testing/development purposes
 */
export const clearPropertyListings = async (): Promise<{success: boolean, message: string}> => {
  try {
    logger.info('Attempting to clear all property listings from the database');
    
    // Delete all records from the property_listings table
    const { error, count } = await supabase
      .from('property_listings')
      .delete()
      .neq('id', '') // Delete all records (using a condition that's always true)
      .select('count');
      
    if (error) {
      logger.error('Error clearing property listings:', error);
      return {
        success: false,
        message: `Failed to clear listings: ${error.message}`
      };
    }
    
    logger.info(`Successfully deleted ${count} property listings`);
    return {
      success: true,
      message: `Successfully cleared ${count} property listings from the database`
    };
  } catch (err: any) {
    logger.error('Unexpected error clearing property listings:', err);
    return {
      success: false,
      message: `An unexpected error occurred: ${err.message}`
    };
  }
};
