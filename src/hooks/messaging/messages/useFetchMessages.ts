
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { Message } from "@/types/message";
import { MessagesState } from "./types";

export function useFetchMessages() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchMessages = async (
    conversationId: string,
    setState: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
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
      
      return data as Message[] | null;
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Could not load messages",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false, messages: [] }));
      return null;
    }
  };

  return { fetchMessages };
}
