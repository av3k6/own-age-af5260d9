
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { toast } from "sonner";
import { ConversationsState } from "./types";

export function useFetchConversations() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const fetchConversations = async (
    setState: React.Dispatch<React.SetStateAction<ConversationsState>>
  ) => {
    if (!user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log("Fetching conversations for user:", user.id);
      
      // Check supabase connection first
      try {
        const { data: connectionTest, error: connectionError } = await supabase.from('health_check').select('*').limit(1);
        if (connectionError) {
          throw new Error(`Supabase connection error: ${connectionError.message}`);
        }
      } catch (connError) {
        console.error("Database connection test failed:", connError);
        throw new Error("Unable to connect to the database. Please check your connection.");
      }
      
      // Fetch conversations
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id]);
        
      if (error) {
        console.error("Error in supabase query:", error);
        throw error;
      }
      
      console.log("Conversations fetched:", data?.length || 0);
      
      // Map database column names to our client-side property names
      const mappedConversations = data?.map(conv => ({
        id: conv.id,
        participants: conv.participants || [],
        lastMessageAt: conv.last_message_at,
        subject: conv.subject || "",
        propertyId: conv.property_id,
        unreadCount: conv.unread_count || 0,
        category: conv.category || "GENERAL",
        isEncrypted: conv.is_encrypted
      })) || [];
      
      setState(prev => ({
        ...prev,
        loading: false,
        conversations: mappedConversations,
        filteredConversations: mappedConversations
      }));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      setState(prev => ({ ...prev, loading: false }));
      
      // Re-throw the error so it can be caught by the initialization hook
      throw error;
    }
  };

  return { fetchConversations };
}
