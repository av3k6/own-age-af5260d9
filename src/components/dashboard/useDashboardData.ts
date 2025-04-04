
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { createLogger } from "@/utils/logger";
import { User } from "@/types";

const logger = createLogger("useDashboardData");

export const useDashboardData = (user: User | null) => {
  const { supabase } = useSupabase();
  const [listingsCount, setListingsCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [showingsCount, setShowingsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch property listings count
        const { count: listingsCount, error: listingsError } = await supabase
          .from('property_listings')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id);
          
        if (listingsError) {
          logger.error("Error fetching listings count:", listingsError);
        } else {
          setListingsCount(listingsCount || 0);
        }
        
        // Also try with seller_email
        if (user.email) {
          const { count: emailListingsCount, error: emailError } = await supabase
            .from('property_listings')
            .select('*', { count: 'exact', head: true })
            .eq('seller_email', user.email);
            
          if (!emailError && emailListingsCount && emailListingsCount > 0) {
            // If we found more listings by email, use that count
            setListingsCount(prev => Math.max(prev, emailListingsCount));
          }
        }
        
        // Fetch documents count
        const { count: docsCount, error: docsError } = await supabase
          .from('property_documents')
          .select('*', { count: 'exact', head: true })
          .eq('uploaded_by', user.id);
          
        if (docsError) {
          logger.error("Error fetching documents count:", docsError);
        } else {
          setDocumentsCount(docsCount || 0);
        }
        
        // Fetch viewings/showings count
        const { count: viewingsCount, error: viewingsError } = await supabase
          .from('property_viewings')
          .select('*', { count: 'exact', head: true })
          .eq('buyer_id', user.id)
          .eq('status', 'APPROVED');
          
        if (viewingsError) {
          logger.error("Error fetching viewings count:", viewingsError);
        } else {
          setShowingsCount(viewingsCount || 0);
        }
        
        // Fetch unread messages count
        try {
          const { count: unreadCount, error: unreadError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .contains('participants', [user.id])
            .gt('unread_count', 0);
            
          if (!unreadError) {
            setMessagesCount(unreadCount || 0);
          }
        } catch (msgError) {
          logger.error("Error fetching messages count:", msgError);
          // Non-fatal error - continue without messages count
        }
        
      } catch (error) {
        logger.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCounts();
  }, [user, supabase]);

  return {
    listingsCount,
    documentsCount,
    showingsCount,
    messagesCount,
    isLoading
  };
};
