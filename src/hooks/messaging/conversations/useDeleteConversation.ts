
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ConversationsState } from "./types";

export function useDeleteConversation() {
  const [deleting, setDeleting] = useState(false);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const deleteConversation = async (
    conversationId: string,
    setState?: React.Dispatch<React.SetStateAction<ConversationsState>>
  ) => {
    if (!user) return;
    
    setDeleting(true);
    try {
      console.log("Deleting conversation:", conversationId);
      
      // First, verify the user is a participant in this conversation
      const { data: conversation, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching conversation to delete:", fetchError);
        throw fetchError;
      }
      
      if (!conversation) {
        throw new Error("Conversation not found");
      }
      
      // Check if user is authorized to delete this conversation
      if (!conversation.participants.includes(user.id)) {
        throw new Error("You are not authorized to delete this conversation");
      }

      // Delete the conversation
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);
        
      if (error) {
        console.error("Error deleting conversation:", error);
        throw error;
      }
      
      console.log("Conversation deleted successfully");
      
      // Update local state if provided
      if (setState) {
        setState(prev => ({
          ...prev,
          conversations: prev.conversations.filter(conv => conv.id !== conversationId),
          currentConversation: prev.currentConversation?.id === conversationId ? null : prev.currentConversation
        }));
      }
      
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed from your inbox",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error deleting conversation",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteConversation, deleting };
}
