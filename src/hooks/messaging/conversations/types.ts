
import { Conversation } from "@/types/message";
import { ConversationCategory, ConversationFilterParams } from "@/types/encryption";

export interface ConversationsState {
  loading: boolean;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  filteredConversations: Conversation[];
  filters: ConversationFilterParams;
  searchTerm: string;
}

export interface ConversationActions {
  fetchConversations: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createConversation: (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string,
    category?: string,
    isEncrypted?: boolean
  ) => Promise<Conversation | null>;
  setFilters: (filters: ConversationFilterParams) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export interface UseConversationsReturn extends Omit<ConversationsState, 'filteredConversations'>, ConversationActions {
  filteredConversations: Conversation[];
}
