
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/types/message";
import { MessagesState } from "./types";
import { useAttachmentUpload } from "./useAttachmentUpload";
import { useConversationUpdate } from "./useConversationUpdate";
import { useMessageEncryption } from "./useMessageEncryption";
import { MessageDeliveryStatus } from "@/types/encryption";

export function useSendMessage() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadAttachments } = useAttachmentUpload();
  const { getConversationParticipants, updateConversationLastMessage } = useConversationUpdate();
  const { encryptMessageContent } = useMessageEncryption();

  const sendMessage = async (
    conversationId: string, 
    content: string, 
    attachments?: File[],
    setState?: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    if (!user || !content.trim()) {
      toast({
        title: "Cannot send message",
        description: "Message cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (setState) {
      setState(prev => ({ ...prev, loading: true }));
    }
    
    try {
      console.log("Sending message to conversation:", conversationId);
      
      // Get the conversation participants to find the recipient
      const conversation = await getConversationParticipants(conversationId);
      
      // Find the recipient (the participant who isn't the current user)
      const receiverId = conversation.participants.find((id: string) => id !== user.id);
      if (!receiverId) throw new Error("Recipient not found");
      
      // Encrypt message if needed
      const { displayContent, encryptedContent } = await encryptMessageContent(
        content,
        receiverId,
        conversation.is_encrypted
      );
      
      // Create message object with snake_case keys for the database
      const newMessage: any = {
        sender_id: user.id,
        receiver_id: receiverId,
        content: displayContent,
        read: false,
        conversation_id: conversationId,
        created_at: new Date().toISOString(),
        delivery_status: MessageDeliveryStatus.SENT
      };
      
      // Add encrypted content if available
      if (encryptedContent) {
        newMessage.encrypted_content = encryptedContent;
      }
      
      // Upload attachments if any
      let messageAttachments = [];
      if (attachments && attachments.length > 0) {
        messageAttachments = await uploadAttachments(conversationId, attachments);
        newMessage.attachments = messageAttachments;
      }
      
      // Insert message
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
        
      if (error) {
        console.error("Error inserting message:", error);
        throw error;
      }
      
      console.log("Message sent successfully:", data);
      
      // Update conversation's last message timestamp
      await updateConversationLastMessage(conversationId, conversation.unread_count);
        
      // Update local state if provided
      if (data && data.length > 0 && setState) {
        updateLocalMessageState(data[0], content, encryptedContent, setState);
      } else if (setState) {
        setState(prev => ({ ...prev, loading: false }));
      }
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      if (setState) {
        setState(prev => ({ ...prev, loading: false }));
      }
      throw error;
    }
  };

  // Helper function to update the local state with the new message
  const updateLocalMessageState = (
    messageData: any, 
    originalContent: string,
    encryptedContent: any,
    setState: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    // Convert from snake_case to camelCase for frontend use
    const mappedMessage = {
      id: messageData.id,
      senderId: messageData.sender_id,
      receiverId: messageData.receiver_id,
      content: encryptedContent ? originalContent : messageData.content,  // Use the original content if encrypted
      read: messageData.read,
      conversationId: messageData.conversation_id,
      createdAt: messageData.created_at,
      attachments: messageData.attachments || [],
      encryptedContent: messageData.encrypted_content,
      deliveryStatus: messageData.delivery_status || MessageDeliveryStatus.SENT
    };
    
    setState(prev => {
      // Remove the temporary message (if any) and add the real one
      const filteredMessages = prev.messages.filter(
        msg => !msg.id.startsWith('temp-')
      );
      return {
        ...prev,
        messages: [...filteredMessages, mappedMessage],
        loading: false
      };
    });
  };

  return { sendMessage };
}
