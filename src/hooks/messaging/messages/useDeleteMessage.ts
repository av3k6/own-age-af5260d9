
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MessagesState } from "./types";

export function useDeleteMessage() {
  const [deleting, setDeleting] = useState(false);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();

  const deleteMessage = async (
    messageId: string,
    setState?: React.Dispatch<React.SetStateAction<MessagesState>>
  ) => {
    if (!user) return;
    
    setDeleting(true);
    try {
      console.log("Deleting message:", messageId);
      
      // First, get the message to check if the current user is the sender or receiver
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching message to delete:", fetchError);
        throw fetchError;
      }
      
      if (!message) {
        throw new Error("Message not found");
      }
      
      // Check if user is authorized to delete this message
      if (message.sender_id !== user.id && message.receiver_id !== user.id) {
        throw new Error("You are not authorized to delete this message");
      }

      // In our approach, we'll mark the message as deleted for this user
      // Rather than actually deleting it from the database
      let updateField = {};
      if (message.sender_id === user.id) {
        updateField = { deleted_by_sender: true };
      } else {
        updateField = { deleted_by_receiver: true };
      }
      
      const { error } = await supabase
        .from('messages')
        .update(updateField)
        .eq('id', messageId);
        
      if (error) {
        console.error("Error marking message as deleted:", error);
        throw error;
      }
      
      console.log("Message marked as deleted successfully");
      
      // Update local state if provided
      if (setState) {
        setState(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== messageId)
        }));
      }
      
      toast({
        title: "Message deleted",
        description: "The message has been removed from your conversation",
      });
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error deleting message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return { deleteMessage, deleting };
}
