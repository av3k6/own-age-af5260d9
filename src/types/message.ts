
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  subject?: string;
  read: boolean;
  createdAt: string;
  attachments?: Attachment[];
  conversationId: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessageAt: string;
  subject?: string;
  propertyId?: string;
  unreadCount: number;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
  type: string;
}
