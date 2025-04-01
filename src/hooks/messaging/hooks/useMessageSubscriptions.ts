
import { useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";

export function useMessageSubscriptions(fetchConversations: () => Promise<void>) {
  const { supabase } = useSupabase();
  const { user } = useAuth();

  // Set up real-time subscriptions with improved cleanup
  useEffect(() => {
    if (!user) return;
    
    console.log("Setting up conversation subscription for user:", user.id);
    
    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel(`user-conversations-${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${user.id}}`
      }, (payload) => {
        console.log("Conversation change detected:", payload.eventType);
        // Refresh conversations list when there are changes
        fetchConversations().catch(error => {
          console.error("Error refreshing conversations after update:", error);
        });
      })
      .subscribe((status) => {
        console.log(`Conversation subscription status: ${status}`);
      });
      
    return () => {
      console.log("Cleaning up conversation subscription");
      supabase.removeChannel(conversationsChannel);
    };
  }, [user?.id, supabase, fetchConversations]);
}
