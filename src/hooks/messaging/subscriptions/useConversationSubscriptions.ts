
import { useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";

export function useConversationSubscriptions(
  user: any,
  supabase: SupabaseClient,
  fetchConversations: () => Promise<void>
) {
  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel('public:conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${user.id}}`
      }, () => {
        // Refresh conversations list when there are changes
        fetchConversations();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [user, supabase, fetchConversations]);
}
