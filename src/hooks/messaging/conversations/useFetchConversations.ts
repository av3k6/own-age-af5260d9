
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useTableManagement } from "./useTableManagement";
import { ConversationsState } from "./types";
import { Conversation } from "@/types/message";

export function useFetchConversations() {
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  const { ensureTablesExist } = useTableManagement();

  const fetchConversations = async (
    setState: React.Dispatch<React.SetStateAction<ConversationsState>>
  ) => {
    if (!user) return;
    
    setState(prev => ({ ...prev, loading: true }));
    try {
      console.log("Fetching conversations for user:", user.id);
      
      // Check if tables exist and create if needed
      await ensureTablesExist();
      
      // Fetch conversations
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id])
        .order('lastMessageAt', { ascending: false });
        
      if (error) {
        console.error("Error fetching conversations:", error);
        throw error;
      }
      
      console.log("Conversations fetched:", data?.length || 0, data);
      setState(prev => ({ 
        ...prev, 
        conversations: data || [],
        loading: false
      }));
      
      return data as Conversation[] | null;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Could not load conversations",
        description: "Please try again later",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, loading: false, conversations: [] }));
      return null;
    }
  };

  return { fetchConversations };
}
