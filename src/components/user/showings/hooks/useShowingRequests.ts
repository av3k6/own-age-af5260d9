
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ViewingRequest } from "@/types/showing";
import { ShowingStatus } from "@/types/enums";

export function useShowingRequests(isBuyer: boolean) {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [showings, setShowings] = useState<ViewingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch showing requests
  useEffect(() => {
    if (!user) return;
    
    const fetchShowingRequests = async () => {
      setIsLoading(true);
      
      try {
        const query = supabase
          .from('property_viewings')
          .select('*');
          
        // Filter based on user role
        if (isBuyer) {
          query.eq('buyer_id', user.id);
        } else {
          query.eq('seller_id', user.id);
        }
        
        // Order by most recent first
        query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          // Transform the data to match the ViewingRequest type
          const formattedShowings: ViewingRequest[] = data.map(showing => ({
            id: showing.id,
            propertyId: showing.property_id,
            sellerId: showing.seller_id,
            buyerId: showing.buyer_id,
            buyerName: showing.buyer_name,
            buyerEmail: showing.buyer_email,
            buyerPhone: showing.buyer_phone,
            requestedDate: showing.requested_date,
            requestedTimeStart: showing.requested_time_start,
            requestedTimeEnd: showing.requested_time_end,
            status: showing.status as ShowingStatus,
            buyerNotes: showing.buyer_notes,
            sellerNotes: showing.seller_notes,
            isVirtual: showing.is_virtual,
            meetingLink: showing.meeting_link,
            createdAt: showing.created_at,
            updatedAt: showing.updated_at
          }));
          
          setShowings(formattedShowings);
        }
      } catch (error) {
        console.error("Error fetching showing requests:", error);
        toast({
          title: "Error",
          description: "Failed to load showing requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchShowingRequests();
  }, [user, isBuyer, supabase, toast]);
  
  // Change showing request status
  const changeShowingStatus = async (id: string, status: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('property_viewings')
        .update({ 
          status, 
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Update local state
      setShowings(prevShowings => 
        prevShowings.map(showing => 
          showing.id === id ? { ...showing, status: status as ShowingStatus } : showing
        )
      );
      
      return true;
    } catch (error) {
      console.error("Error updating showing status:", error);
      toast({
        title: "Error",
        description: "Failed to update showing status",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return { showings, isLoading, changeShowingStatus };
}
