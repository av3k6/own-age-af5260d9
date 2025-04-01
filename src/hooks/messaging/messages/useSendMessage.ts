
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Message, Attachment } from "@/types/message";
import { MessagesState } from "./types";

export function useSendMessage() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

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
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (convError) {
        console.error("Error fetching conversation:", convError);
        throw new Error("Conversation not found");
      }
      
      if (!conversation) throw new Error("Conversation not found");
      
      // Find the recipient (the participant who isn't the current user)
      const receiverId = conversation.participants.find((id: string) => id !== user.id);
      if (!receiverId) throw new Error("Recipient not found");
      
      // Create message object
      const newMessage: Partial<Message> = {
        senderId: user.id,
        receiverId,
        content,
        read: false,
        conversationId,
        createdAt: new Date().toISOString(),
      };
      
      // Upload attachments if any
      let messageAttachments: Attachment[] = [];
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
      
      // Update conversation's last message timestamp and increment unread count for recipient
      await supabase
        .from('conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          // Only increment unread count for the recipient, not the sender
          unread_count: conversation.unread_count + 1
        })
        .eq('id', conversationId);
        
      // Update local state if provided
      if (data && data.length > 0 && setState) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data[0]],
          loading: false
        }));
      }
      
      if (setState) {
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

  const uploadAttachments = async (conversationId: string, files: File[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];
    
    for (const file of files) {
      try {
        const filePath = `messages/${conversationId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);
          
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
          
        attachments.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
        });
      } catch (uploadError) {
        console.error("Error uploading attachment:", uploadError);
        toast({
          title: "Upload error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    return attachments;
  };

  return { sendMessage };
}
