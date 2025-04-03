
import { supabase } from '@/lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  user_id?: string;
  preferred_contact?: string;
  best_time?: string;
}

interface ContactPreferences {
  user_id: string;
  preferred_contact_method: string;
  preferred_contact_time: string;
}

/**
 * Submit contact form data to Supabase
 */
export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([formData]);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Update user contact preferences
 */
export const updateContactPreferences = async (preferences: ContactPreferences) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        preferred_contact_method: preferences.preferred_contact_method,
        preferred_contact_time: preferences.preferred_contact_time
      })
      .eq('user_id', preferences.user_id);
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error updating contact preferences:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

/**
 * Send email confirmation to user
 * Note: In a real implementation, this would call a serverless function or backend API
 */
export const sendEmailConfirmation = async (email: string, name: string) => {
  // This is a placeholder for an actual email sending implementation
  console.log(`Would send confirmation email to ${name} at ${email}`);
  return { success: true };
};

/**
 * Track analytics event
 * This is a placeholder for actual analytics implementation
 */
export const trackContactEvent = (eventName: string, properties: Record<string, any> = {}) => {
  console.log(`[Analytics] Tracking event: ${eventName}`, properties);
  // In a real implementation, you would call your analytics service here
  // e.g., mixpanel.track(eventName, properties);
};
