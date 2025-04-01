
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation } from "@/types/message";
import { ConversationCategory } from "@/types/encryption";
import { ConversationFilterParams, ConversationsState, UseConversationsReturn } from "./types";
import { useFetchConversations } from "./useFetchConversations";
import { useCreateConversation } from "./useCreateConversation";
import { useSupabase } from "@/hooks/useSupabase";

export function useConversations(): UseConversationsReturn {
  const [state, setState] = useState<ConversationsState>({
    loading: false,
    conversations: [],
    currentConversation: null,
    filteredConversations: [],
    filters: {
      category: undefined,
      propertyId: undefined,
      hasUnread: undefined,
      participant: undefined,
    },
    searchTerm: ""
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

  // Apply filters and search whenever conversations, filters, or searchTerm changes
  useEffect(() => {
    applyFiltersAndSearch();
  }, [state.conversations, state.filters, state.searchTerm]);

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

  // Apply filters and search to conversations
  const applyFiltersAndSearch = () => {
    const { conversations, filters, searchTerm } = state;
    let filtered = [...conversations];
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(conv => conv.category === filters.category);
    }
    
    // Apply property filter
    if (filters.propertyId) {
      filtered = filtered.filter(conv => conv.propertyId === filters.propertyId);
    }
    
    // Apply unread filter
    if (filters.hasUnread) {
      filtered = filtered.filter(conv => conv.unreadCount > 0);
    }
    
    // Apply participant filter
    if (filters.participant) {
      filtered = filtered.filter(conv => 
        conv.participants.some(p => p.includes(filters.participant || ""))
      );
    }
    
    // Apply search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(conv => 
        (conv.subject || "").toLowerCase().includes(lowerSearch) || 
        (conv.propertyId || "").toLowerCase().includes(lowerSearch)
      );
    }
    
    setState(prev => ({ ...prev, filteredConversations: filtered }));
  };

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
    propertyId?: string,
    category: string = ConversationCategory.GENERAL,
    isEncrypted: boolean = true
  ): Promise<Conversation | null> => {
    return await createConversationBase(receiverId, subject, initialMessage, propertyId, category, isEncrypted, setState);
  };

  const setFilters = (filters: ConversationFilterParams) => {
    setState(prev => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  };

  const setSearchTerm = (searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  };

  return {
    loading: state.loading,
    conversations: state.conversations,
    filteredConversations: state.filteredConversations.length > 0 
      ? state.filteredConversations 
      : state.conversations,
    currentConversation: state.currentConversation,
    filters: state.filters,
    searchTerm: state.searchTerm,
    fetchConversations,
    setCurrentConversation,
    createConversation,
    setFilters,
    setSearchTerm
  };
}
