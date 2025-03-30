
import { Conversation, Message, Attachment } from "@/types/message";

export interface MessagingState {
  loading: boolean;
  conversations: Conversation[];
  messages: Message[];
  currentConversation: Conversation | null;
}

// Re-export conversation types
export * from './conversations/types';
// Re-export message types
export * from './messages/types';

export interface UseMessagesReturn {
  loading: boolean;
  messages: Message[];
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
}
