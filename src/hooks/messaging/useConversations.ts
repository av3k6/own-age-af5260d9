
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation } from "@/types/message";
import { MessagingState, UseConversationsReturn } from "./types";

export function useConversations(): UseConversationsReturn {
  const [state, setState] = useState<Pick<MessagingState, 'loading' | 'conversations' | 'currentConversation'>>({
    loading: false,
    conversations: [],
    currentConversation: null
  });
  
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('lastMessageAt', { ascending: false });
        
      if (error) throw error;
      
      setState(prev => ({ 
        ...prev, 
        conversations: data || [],
        loading: false
      }));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const createConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ): Promise<Conversation | null> => {
    if (!user) return null;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Check if conversation already exists
      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, receiverId]);
        
      if (existingConversations && existingConversations.length > 0) {
        // Conversation exists, return it
        const conversation = existingConversations[0];
        setState(prev => ({ 
          ...prev, 
          currentConversation: conversation,
          loading: false 
        }));
        
        return conversation;
      }
      
      // Create new conversation
      const newConversation = {
        participants: [user.id, receiverId],
        lastMessageAt: new Date().toISOString(),
        subject,
        propertyId,
        unreadCount: 0,
      };
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select();
        
      if (error) throw error;
      
      const conversation = data[0];
      
      // Update local state
      setState(prev => ({
        ...prev,
        conversations: [conversation, ...prev.conversations],
        currentConversation: conversation,
        loading: false
      }));
      
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
      return null;
    }
  };

  const setCurrentConversation = (conversation: Conversation | null) => {
    setState(prev => ({ ...prev, currentConversation: conversation }));
  };

  return {
    loading: state.loading,
    conversations: state.conversations,
    fetchConversations,
    currentConversation: state.currentConversation,
    setCurrentConversation,
    createConversation
  };
}
