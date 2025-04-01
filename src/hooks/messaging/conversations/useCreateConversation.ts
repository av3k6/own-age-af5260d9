
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation } from "@/types/message";
import { ConversationCategory } from "@/types/encryption";
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
    category: string = ConversationCategory.GENERAL,
    isEncrypted: boolean = true,
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
          conv => conv.property_id === propertyId
        );
      }
      
      if (filteredConversations.length > 0) {
        // Conversation exists, return it
        const conversation = filteredConversations[0];
        console.log("Found existing conversation:", conversation.id);
        
        // Convert from snake_case to camelCase for frontend use
        const camelCaseConversation: Conversation = {
          id: conversation.id,
          participants: conversation.participants,
          lastMessageAt: conversation.last_message_at,
          subject: conversation.subject || '',
          propertyId: conversation.property_id || null,
          unreadCount: conversation.unread_count || 0,
          category: conversation.category || ConversationCategory.GENERAL,
          isEncrypted: conversation.is_encrypted || false
        };
        
        if (setState) {
          setState(prev => ({ 
            ...prev, 
            currentConversation: camelCaseConversation,
            loading: false 
          }));
        }
        
        return camelCaseConversation;
      }
      
      // Create new conversation
      const newConversation = {
        participants: [user.id, receiverId],
        last_message_at: new Date().toISOString(),
        subject: subject || '',
        property_id: propertyId || null,
        unread_count: 0,
        category: category || ConversationCategory.GENERAL,
        is_encrypted: isEncrypted
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
      
      // Convert from snake_case to camelCase for frontend use
      const camelCaseConversation: Conversation = {
        id: data[0].id,
        participants: data[0].participants,
        lastMessageAt: data[0].last_message_at,
        subject: data[0].subject || '',
        propertyId: data[0].property_id || null,
        unreadCount: data[0].unread_count || 0,
        category: data[0].category || ConversationCategory.GENERAL,
        isEncrypted: data[0].is_encrypted || false
      };
      
      // Update local state if setState provided
      if (setState) {
        setState(prev => ({
          ...prev,
          conversations: [camelCaseConversation, ...prev.conversations],
          currentConversation: camelCaseConversation,
          loading: false
        }));
      }
      
      toast({
        title: "Conversation created",
        description: "You can now start messaging",
      });
      
      return camelCaseConversation;
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
