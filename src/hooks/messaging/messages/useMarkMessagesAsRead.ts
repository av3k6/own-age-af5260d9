
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { MessagesState } from "./types";

export function useMarkMessagesAsRead() {
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const markMessagesAsRead = async (
    conversationId: string,
    setState?: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    if (!user) return;
    
    try {
      // Update messages in the database
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversationId', conversationId)
        .eq('receiverId', user.id)
        .eq('read', false);
      
      // Update local state if provided
      if (setState) {
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg => 
            msg.receiverId === user.id && !msg.read 
              ? { ...msg, read: true } 
              : msg
          )
        }));
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return { markMessagesAsRead };
}
