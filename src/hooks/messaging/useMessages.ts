
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Message, Attachment } from "@/types/message";
import { UseMessagesReturn } from "./types";

export function useMessages(): UseMessagesReturn {
  const [state, setState] = useState<{
    loading: boolean;
    messages: Message[];
  }>({
    loading: false,
    messages: []
  });
  
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });
        
      if (error) throw error;
      
      setState(prev => ({
        ...prev,
        messages: data || [],
        loading: false
      }));
      
      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error fetching messages",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    if (!user || !content.trim()) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      // Get the conversation participants to find the recipient
      const { data: conversation } = await supabase
        .from('conversations')
        .select('participants')
        .eq('id', conversationId)
        .single();
      
      if (!conversation) throw new Error("Conversation not found");
      
      // Find the recipient (the participant who isn't the current user)
      const receiverId = conversation.participants.find(id => id !== user.id);
      if (!receiverId) throw new Error("Recipient not found");
      
      // Create message with proper typing
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
        for (const file of attachments) {
          const filePath = `messages/${conversationId}/${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from('attachments')
            .upload(filePath, file);
            
          if (error) throw error;
          
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);
            
          messageAttachments.push({
            id: crypto.randomUUID(), // Generate a unique ID for the attachment
            name: file.name,
            size: file.size,
            type: file.type,
            url: urlData.publicUrl,
          });
        }
      }
      
      // Add attachments to message if any
      if (messageAttachments.length > 0) {
        newMessage.attachments = messageAttachments;
      }
      
      // Insert message
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
        
      if (error) throw error;
      
      // Update conversation's last message timestamp
      await supabase
        .from('conversations')
        .update({ lastMessageAt: new Date().toISOString() })
        .eq('id', conversationId);
        
      // Update local state
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, data[0]],
        loading: false
      }));
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;
    
    try {
      // Update messages in the database
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversationId', conversationId)
        .eq('receiverId', user.id)
        .eq('read', false);
      
      // Update local state
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.receiverId === user.id && !msg.read 
            ? { ...msg, read: true } 
            : msg
        )
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    loading: state.loading,
    messages: state.messages,
    fetchMessages,
    sendMessage,
    markMessagesAsRead
  };
}
