
import { Message, Attachment } from "@/types/message";

export interface MessagesState {
  loading: boolean;
  messages: Message[];
}

export interface MessageActions {
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, attachments?: File[]) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
}

export interface UseMessagesReturn extends MessagesState, MessageActions {}
