
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Message } from "@/types/message";
import { MessagesState } from "./types";

export function useFetchMessages() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchMessages = async (
    conversationId: string,
    setState: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    if (!user) return null;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log("Fetching messages for conversation:", conversationId);
      
      // Fetch messages, excluding those deleted by the current user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .or(`deleted_by_sender.eq.false,deleted_by_receiver.eq.false`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Error in supabase query:", error);
        throw error;
      }
      
      console.log("Messages fetched:", data?.length || 0);
      
      // Filter out messages deleted by the current user
      const filteredMessages = data?.filter(msg => {
        if (msg.sender_id === user.id && msg.deleted_by_sender) {
          return false;
        }
        if (msg.receiver_id === user.id && msg.deleted_by_receiver) {
          return false;
        }
        return true;
      });
      
      // Map database column names to our client-side property names
      const mappedMessages = filteredMessages?.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        read: msg.read,
        createdAt: msg.created_at,
        attachments: msg.attachments || []
      })) || [];
      
      setState(prev => ({
        ...prev,
        messages: mappedMessages,
        loading: false
      }));
      
      return mappedMessages as Message[] | null;
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Could not load messages",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false, messages: [] }));
      return null;
    }
  };

  return { fetchMessages };
}
