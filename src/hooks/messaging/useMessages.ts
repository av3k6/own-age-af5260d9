
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
      console.log("Fetching messages for conversation:", conversationId);
      
      // Check if the conversation exists
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (convError) {
        console.error("Error fetching conversation:", convError);
        if (!convError.message.includes('No rows found')) {
          throw new Error("Error fetching conversation");
        }
        // If "No rows found", we'll create an empty messages array
      }
      
      // Fetch messages
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });
        
      if (error) {
        console.error("Error in supabase query:", error);
        if (!error.message.includes('does not exist')) {
          throw error;
        }
        // If table doesn't exist, we'll use an empty array
      }
      
      console.log("Messages fetched:", data?.length || 0, data);
      setState(prev => ({
        ...prev,
        messages: data || [],
        loading: false
      }));
      
      // Mark messages as read
      if (data && data.length > 0) {
        await markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Could not load messages",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false, messages: [] }));
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    if (!user || !content.trim()) return;
    
    setState(prev => ({ ...prev, loading: true }));
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
      
      // Create message with proper typing
      const newMessage: Partial<Message> = {
        senderId: user.id,
        receiverId,
        content,
        read: false,
        conversationId,
        createdAt: new Date().toISOString(),
      };
      
      console.log("Preparing to send message:", {
        senderId: user.id,
        receiverId,
        conversationId,
        content: content.substring(0, 30) + (content.length > 30 ? '...' : '')
      });
      
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
        
      if (error) {
        console.error("Error inserting message:", error);
        throw error;
      }
      
      console.log("Message sent successfully:", data);
      
      // Update conversation's last message timestamp
      await supabase
        .from('conversations')
        .update({ 
          lastMessageAt: new Date().toISOString(),
          unreadCount: conversation.unreadCount + 1
        })
        .eq('id', conversationId);
        
      // Update local state
      if (data && data.length > 0) {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, data[0]],
          loading: false
        }));
        
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false }));
      throw error; // Re-throw to allow handling in the component
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
