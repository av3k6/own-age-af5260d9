
import { Conversation } from "@/types/message";

export interface ConversationsState {
  loading: boolean;
  conversations: Conversation[];
  currentConversation: Conversation | null;
}

export interface ConversationActions {
  fetchConversations: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  createConversation: (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ) => Promise<Conversation | null>;
}

export interface UseConversationsReturn extends ConversationsState, ConversationActions {}
