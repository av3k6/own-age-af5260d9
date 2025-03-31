
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
      
      // Fetch messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });
        
      if (error) {
        console.error("Error in supabase query:", error);
        throw error;
      }
      
      console.log("Messages fetched:", data?.length || 0);
      setState(prev => ({
        ...prev,
        messages: data || [],
        loading: false
      }));
      
      return data as Message[] | null;
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
