
import { useSupabase } from "@/hooks/useSupabase";

export function useConversationUpdate() {
  const { supabase } = useSupabase();
  
  const getConversationParticipants = async (conversationId: string) => {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();
    
    if (convError) {
      console.error("Error fetching conversation:", convError);
      throw new Error("Conversation not found");
    }
    
    if (!conversation) throw new Error("Conversation not found");
    
    return conversation;
  };
  
  const updateConversationLastMessage = async (conversationId: string, unreadCount: number) => {
    // Update conversation's last message timestamp and increment unread count for recipient
    return await supabase
      .from('conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
        unread_count: unreadCount + 1
      })
      .eq('id', conversationId);
  };
  
  return { 
    getConversationParticipants,
    updateConversationLastMessage
  };
}
