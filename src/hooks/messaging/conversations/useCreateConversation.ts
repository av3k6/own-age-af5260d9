
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation } from "@/types/message";
import { ConversationsState } from "./types";

export function useCreateConversation() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const createConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string,
    setState?: React.Dispatch<React.SetStateAction<ConversationsState>>
  ): Promise<Conversation | null> => {
    if (!user) return null;
    
    if (setState) {
      setState(prev => ({ ...prev, loading: true }));
    }
    
    try {
      console.log("Creating conversation with receiver:", receiverId);
      
      // Check if conversation already exists between these users
      const { data: existingConversations, error: existingError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, receiverId]);
        
      if (existingError) {
        console.error("Error checking existing conversations:", existingError);
      }
        
      // If property ID is provided, check for a conversation with that property
      let filteredConversations = existingConversations || [];
      if (propertyId && existingConversations) {
        filteredConversations = existingConversations.filter(
          conv => conv.propertyId === propertyId
        );
      }
      
      if (filteredConversations.length > 0) {
        // Conversation exists, return it
        const conversation = filteredConversations[0];
        console.log("Found existing conversation:", conversation.id);
        
        if (setState) {
          setState(prev => ({ 
            ...prev, 
            currentConversation: conversation,
            loading: false 
          }));
        }
        
        return conversation;
      }
      
      // Create new conversation
      const newConversation = {
        participants: [user.id, receiverId],
        lastMessageAt: new Date().toISOString(),
        subject: subject || '',
        propertyId: propertyId || null,
        unreadCount: 0,
      };
      
      console.log("Creating new conversation:", newConversation);
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select();
        
      if (error) {
        console.error("Error creating conversation:", error);
        throw error;
      }
      
      console.log("Created new conversation:", data[0]);
      const conversation = data[0] as Conversation;
      
      // Update local state if setState provided
      if (setState) {
        setState(prev => ({
          ...prev,
          conversations: [conversation, ...prev.conversations],
          currentConversation: conversation,
          loading: false
        }));
      }
      
      toast({
        title: "Conversation created",
        description: "You can now start messaging",
      });
      
      return conversation;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error creating conversation",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      
      if (setState) {
        setState(prev => ({ ...prev, loading: false }));
      }
      return null;
    }
  };

  return { createConversation };
}
