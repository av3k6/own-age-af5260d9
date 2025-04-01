
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation } from "@/types/message";
import { ConversationsState } from "./types";

export function useFetchConversations() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async (
    setState?: React.Dispatch<React.SetStateAction<ConversationsState>>
  ) => {
    if (!user) return;
    
    if (setState) {
      setState(prev => ({ ...prev, loading: true }));
    }
    
    try {
      console.log("Fetching conversations for user:", user.id);
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('last_message_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
      
      console.log("Conversations fetched:", data.length);
      
      // Convert from snake_case to camelCase for frontend use
      const conversations: Conversation[] = data.map(conv => ({
        id: conv.id,
        participants: conv.participants,
        lastMessageAt: conv.last_message_at,
        subject: conv.subject || '',
        propertyId: conv.property_id || null,
        unreadCount: conv.unread_count || 0
      }));
      
      if (setState) {
        setState(prev => ({
          ...prev,
          conversations,
          loading: false
        }));
      }
      
      return conversations;
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error loading conversations",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      
      if (setState) {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      return [];
    }
  };

  return { fetchConversations };
}
