
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation } from "@/types/message";
import { ConversationsState, UseConversationsReturn } from "./types";
import { useFetchConversations } from "./useFetchConversations";
import { useCreateConversation } from "./useCreateConversation";

export function useConversations(): UseConversationsReturn {
  const [state, setState] = useState<ConversationsState>({
    loading: false,
    conversations: [],
    currentConversation: null
  });
  
  const { user } = useAuth();
  const { fetchConversations: fetchConversationsBase } = useFetchConversations();
  const { createConversation: createConversationBase } = useCreateConversation();

  // Auto-fetch conversations when the component mounts and user is available
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user?.id]);

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
