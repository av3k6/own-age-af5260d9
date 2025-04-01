
import { useEncryptedMessaging } from "@/hooks/useEncryptedMessaging";
import { EncryptedContent } from "@/types/encryption";

export function useMessageEncryption() {
  const { isEncryptionReady, encryptMessage } = useEncryptedMessaging();
  
  const encryptMessageContent = async (
    content: string, 
    receiverId: string,
    isConversationEncrypted: boolean
  ): Promise<{
    displayContent: string;
    encryptedContent?: EncryptedContent;
  }> => {
    // Only attempt encryption if encryption is ready and the conversation is marked as encrypted
    if (isEncryptionReady && isConversationEncrypted) {
      try {
        const encryptedContentStr = await encryptMessage(content, receiverId);
        const encryptedContent = JSON.parse(encryptedContentStr);
        console.log("Message encrypted successfully");
        return {
          displayContent: "[Encrypted message]",
          encryptedContent
        };
      } catch (encryptError) {
        console.error("Failed to encrypt message:", encryptError);
        // Continue with unencrypted message if encryption fails
      }
    }
    
    // Return original content if no encryption happened
    return {
      displayContent: content
    };
  };
  
  return { encryptMessageContent };
}
