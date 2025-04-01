
import { EncryptedContent, ConversationCategory, MessageDeliveryStatus } from './encryption';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  encryptedContent?: EncryptedContent; // For E2E encryption
  subject?: string;
  read: boolean;
  createdAt: string;
  attachments?: Attachment[];
  conversationId: string;
  deliveryStatus?: MessageDeliveryStatus; // Track delivery status
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageAt: string;
  subject?: string;
  propertyId?: string;
  unreadCount: number;
  category?: ConversationCategory; // Categorization for conversations
  isEncrypted?: boolean; // Flag for encrypted conversations
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
  encryptedData?: EncryptedContent; // For encrypted attachments
}

// Search parameters for messages
export interface MessageSearchParams {
  text?: string;
  dateFrom?: Date;
  dateTo?: Date;
  senderId?: string;
  hasAttachments?: boolean;
}

// Conversation filter parameters
export interface ConversationFilterParams {
  category?: ConversationCategory;
  propertyId?: string;
  hasUnread?: boolean;
  participant?: string;
}
