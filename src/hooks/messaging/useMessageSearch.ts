
import { useState, useCallback } from "react";
import { Conversation } from "@/types/message";
import { ConversationCategory, ConversationFilterParams } from "@/types/encryption";

interface MessageSearchHook {
  searchTerm: string;
  filters: ConversationFilterParams;
  filteredConversations: Conversation[];
  setSearchTerm: (term: string) => void;
  setCategory: (category?: ConversationCategory) => void;
  setHasUnread: (hasUnread?: boolean) => void;
  setParticipantFilter: (participant?: string) => void;
  clearFilters: () => void;
}

export function useMessageSearch(conversations: Conversation[]): MessageSearchHook {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<ConversationFilterParams>({
    category: undefined,
    hasUnread: undefined,
    participant: undefined,
    propertyId: undefined
  });

  const filteredConversations = conversations.filter(conversation => {
    let matches = true;
    
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSubject = (conversation.subject || "").toLowerCase().includes(searchLower);
      const matchesPropertyId = (conversation.propertyId || "").toLowerCase().includes(searchLower);
      
      matches = matches && (matchesSubject || matchesPropertyId);
    }
    
    // Apply category filter
    if (filters.category) {
      matches = matches && conversation.category === filters.category;
    }
    
    // Apply unread filter
    if (filters.hasUnread) {
      matches = matches && conversation.unreadCount > 0;
    }
    
    // Apply participant filter
    if (filters.participant) {
      matches = matches && conversation.participants.some(p => 
        p.toLowerCase().includes(filters.participant!.toLowerCase())
      );
    }
    
    // Apply property filter
    if (filters.propertyId) {
      matches = matches && conversation.propertyId === filters.propertyId;
    }
    
    return matches;
  });

  const setCategory = useCallback((category?: ConversationCategory) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setHasUnread = useCallback((hasUnread?: boolean) => {
    setFilters(prev => ({ ...prev, hasUnread }));
  }, []);

  const setParticipantFilter = useCallback((participant?: string) => {
    setFilters(prev => ({ ...prev, participant }));
  }, []);
  
  const setPropertyFilter = useCallback((propertyId?: string) => {
    setFilters(prev => ({ ...prev, propertyId }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({
      category: undefined,
      hasUnread: undefined,
      participant: undefined,
      propertyId: undefined
    });
  }, []);

  return {
    searchTerm,
    filters,
    filteredConversations,
    setSearchTerm,
    setCategory,
    setHasUnread,
    setParticipantFilter,
    clearFilters
  };
}
