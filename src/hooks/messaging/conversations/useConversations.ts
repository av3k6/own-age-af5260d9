
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation } from "@/types/message";
import { ConversationsState, UseConversationsReturn } from "./types";
import { useFetchConversations } from "./useFetchConversations";
import { useCreateConversation } from "./useCreateConversation";
import { useSupabase } from "@/hooks/useSupabase";

export function useConversations(): UseConversationsReturn {
  const [state, setState] = useState<ConversationsState>({
    loading: false,
    conversations: [],
    currentConversation: null
  });
  
  const { user } = useAuth();
  const { fetchConversations: fetchConversationsBase } = useFetchConversations();
  const { createConversation: createConversationBase } = useCreateConversation();
  const { supabase } = useSupabase();

  // Auto-fetch conversations when the component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user?.id]);

  // Set up subscription for real-time updates
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to conversation changes relevant to the current user
    const conversationChannel = supabase
      .channel('public:conversations')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `participants=cs.{${user.id}}`
      }, (payload) => {
        console.log("Conversation updated:", payload.new);
        
        // Update the conversation in the list
        setState(prev => ({
          ...prev,
          conversations: prev.conversations.map(conv =>
            conv.id === payload.new.id ? { ...payload.new as Conversation } : conv
          ),
          // Also update currentConversation if it's the same one
          currentConversation: prev.currentConversation?.id === payload.new.id 
            ? { ...payload.new as Conversation }
            : prev.currentConversation
        }));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationChannel);
    };
  }, [user, supabase]);

  // Wrapper functions that pass the state setter
  const fetchConversations = async () => {
    await fetchConversationsBase(setState);
  };

  const setCurrentConversation = (conversation: Conversation | null) => {
    setState(prev => ({ ...prev, currentConversation: conversation }));
  };

  const createConversation = async (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ): Promise<Conversation | null> => {
    return await createConversationBase(receiverId, subject, initialMessage, propertyId, setState);
  };

  return {
    loading: state.loading,
    conversations: state.conversations,
    currentConversation: state.currentConversation,
    fetchConversations,
    setCurrentConversation,
    createConversation
  };
}
