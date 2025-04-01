
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from '@/hooks/useSupabase';
import keyManagementService from '@/services/encryption/keyManagementService';
import { Message, Conversation } from '@/types/message';
import { EncryptedContent } from '@/types/encryption';
import { useToast } from '@/components/ui/use-toast';

export interface UseEncryptedMessagingReturn {
  isEncryptionReady: boolean;
  encryptMessage: (message: string, recipientId: string) => Promise<string>;
  decryptMessage: (encryptedMessage: string) => Promise<string>;
  encryptConversation: (conversation: Conversation) => Promise<Conversation>;
  decryptConversation: (conversation: Conversation) => Promise<Conversation>;
  decryptMessages: (messages: Message[]) => Promise<Message[]>;
  isInitializing: boolean;
  error: string | null;
}

export const useEncryptedMessaging = (): UseEncryptedMessagingReturn => {
  const [isEncryptionReady, setIsEncryptionReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Initialize encryption system
  useEffect(() => {
    const initializeEncryption = async () => {
      if (!user) return;
      
      try {
        setIsInitializing(true);
        setError(null);
        
        await keyManagementService.initialize(supabase, user.id);
        setIsEncryptionReady(true);
        console.log("Encryption system initialized successfully");
      } catch (err: any) {
        console.error("Failed to initialize encryption:", err);
        setError(err.message || "Failed to initialize encryption");
        toast({
          title: "Encryption Setup Failed",
          description: "Some messages may not be securely encrypted",
          variant: "destructive",
        });
      } finally {
        setIsInitializing(false);
      }
    };

    if (user) {
      initializeEncryption();
    }
  }, [user?.id]);

  // Encrypt a message for a recipient
  const encryptMessage = useCallback(async (message: string, recipientId: string): Promise<string> => {
    if (!isEncryptionReady) {
      console.warn("Encryption not ready, returning plaintext");
      return message;
    }

    try {
      return await keyManagementService.encryptMessage(message, recipientId);
    } catch (err) {
      console.error("Failed to encrypt message:", err);
      // Fall back to plaintext if encryption fails
      return message;
    }
  }, [isEncryptionReady]);

  // Decrypt a message
  const decryptMessage = useCallback(async (encryptedMessage: string): Promise<string> => {
    if (!isEncryptionReady) {
      console.warn("Encryption not ready, returning message as is");
      return encryptedMessage;
    }

    try {
      // Check if the message is actually encrypted (valid JSON of EncryptedContent)
      try {
        JSON.parse(encryptedMessage);
      } catch {
        // Not encrypted or not valid JSON
        return encryptedMessage;
      }

      return await keyManagementService.decryptMessage(encryptedMessage);
    } catch (err) {
      console.error("Failed to decrypt message:", err);
      // Return indication that decryption failed
      return "[Encrypted message - unable to decrypt]";
    }
  }, [isEncryptionReady]);

  // Process a conversation for encryption
  const encryptConversation = useCallback(async (conversation: Conversation): Promise<Conversation> => {
    // In the future, we might want to encrypt certain conversation metadata
    return {
      ...conversation,
      isEncrypted: true
    };
  }, []);

  // Process a conversation for decryption
  const decryptConversation = useCallback(async (conversation: Conversation): Promise<Conversation> => {
    // In the future, we might want to decrypt certain conversation metadata
    return conversation;
  }, []);

  // Decrypt multiple messages
  const decryptMessages = useCallback(async (messages: Message[]): Promise<Message[]> => {
    if (!isEncryptionReady || messages.length === 0) {
      return messages;
    }

    try {
      const decryptedMessages = await Promise.all(
        messages.map(async (message) => {
          // Check if the message has encrypted content
          if (message.encryptedContent) {
            try {
              // Try to decrypt the message content
              const decryptedContent = await decryptMessage(JSON.stringify(message.encryptedContent));
              return {
                ...message,
                content: decryptedContent
              };
            } catch (err) {
              console.error("Failed to decrypt message:", err);
              return {
                ...message,
                content: "[Encrypted message - unable to decrypt]"
              };
            }
          } else {
            // Message is not encrypted
            return message;
          }
        })
      );

      return decryptedMessages;
    } catch (err) {
      console.error("Error in batch message decryption:", err);
      return messages;
    }
  }, [isEncryptionReady, decryptMessage]);

  return {
    isEncryptionReady,
    encryptMessage,
    decryptMessage,
    encryptConversation,
    decryptConversation,
    decryptMessages,
    isInitializing,
    error
  };
};
