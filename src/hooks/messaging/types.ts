
import { Conversation, Message, Attachment } from "@/types/message";

export interface MessagingState {
  loading: boolean;
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
}

export interface UseConversationsReturn {
  loading: boolean;
  conversations: Conversation[];
  fetchConversations: () => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
  currentConversation: Conversation | null;
  createConversation: (
    receiverId: string, 
    subject?: string, 
    initialMessage?: string, 
    propertyId?: string
  ) => Promise<Conversation | null>;
}

export interface UseMessagesReturn {
  loading: boolean;
  messages: Message[];
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
}
