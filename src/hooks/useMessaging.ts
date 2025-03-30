
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Conversation, Message, Attachment } from "@/types/message";

export function useMessaging() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('lastMessageAt', { ascending: false });
        
      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error fetching conversations",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversationId', conversationId)
        .order('createdAt', { ascending: true });
        
      if (error) throw error;
      
      // Find the conversation
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
      }
      
      setMessages(data || []);
      
      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error fetching messages",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    if (!user || !content.trim()) return;
    
    setLoading(true);
    try {
      // Get the conversation to find the recipient
      const conversation = conversations.find(c => c.id === conversationId);
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
      setMessages([...messages, data[0]]);
      
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
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (receiverId: string, subject?: string, initialMessage?: string, propertyId?: string) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Check if conversation already exists
      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, receiverId]);
        
      if (existingConversations && existingConversations.length > 0) {
        // Conversation exists, return it
        const conversation = existingConversations[0];
        setCurrentConversation(conversation);
        
        // Send initial message if provided
        if (initialMessage) {
          await sendMessage(conversation.id, initialMessage);
        }
        
        return conversation;
      }
      
      // Create new conversation
      const newConversation = {
        participants: [user.id, receiverId],
        lastMessageAt: new Date().toISOString(),
        subject,
        propertyId,
        unreadCount: 0,
      };
      
      const { data, error } = await supabase
        .from('conversations')
        .insert([newConversation])
        .select();
        
      if (error) throw error;
      
      const conversation = data[0];
      
      // Send initial message if provided
      if (initialMessage && conversation) {
        await sendMessage(conversation.id, initialMessage);
      }
      
      // Update local state
      setConversations([conversation, ...conversations]);
      setCurrentConversation(conversation);
      
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Error creating conversation",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
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
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.receiverId === user.id && !msg.read 
            ? { ...msg, read: true } 
            : msg
        )
      );
      
      // Update conversation unread count
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    setCurrentConversation,
  };
}
