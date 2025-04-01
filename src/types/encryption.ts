
export interface EncryptionKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedContent {
  iv: string;       // Initialization vector
  data: string;     // Encrypted data
  encryptedKey?: string; // Encrypted symmetric key (for E2EE)
}

// Status for message delivery
export enum MessageDeliveryStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

// Enhanced message and conversation types with encryption and categorization
export interface EncryptedMessage {
  content: EncryptedContent;
  attachments?: EncryptedContent[];
}

// Categories for conversations
export enum ConversationCategory {
  PROPERTY = 'property',
  OFFER = 'offer',
  DOCUMENT = 'document',
  GENERAL = 'general',
  SUPPORT = 'support'
}
