
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { MessagesState } from "./types";
import { useToast } from "@/components/ui/use-toast";

export function useMarkMessagesAsRead() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const markMessagesAsRead = async (
    conversationId: string,
    setState?: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    if (!user) return;
    
    try {
      console.log(`Marking messages as read for conversation: ${conversationId}`);
      
      // Update messages in the database
      // Fix: Use conversation_id (snake_case) instead of conversationId (camelCase)
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id)
        .eq('read', false);
      
      if (error) {
        console.error("Error marking messages as read:", error);
        throw error;
      }
      
      // Reset unread count for this conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ unread_count: 0 })
        .eq('id', conversationId);
        
      if (updateError) {
        console.error("Error resetting unread count:", updateError);
      }
      
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
      
      console.log("Messages marked as read successfully");
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
      toast({
        title: "Error updating messages",
        description: error.message || "Could not mark messages as read",
        variant: "destructive",
      });
    }
  };

  return { markMessagesAsRead };
}
