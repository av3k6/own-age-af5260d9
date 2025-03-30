
import { useState } from "react";
import { useFetchMessages } from "./useFetchMessages";
import { useMarkMessagesAsRead } from "./useMarkMessagesAsRead";
import { useSendMessage } from "./useSendMessage";
import { MessagesState, UseMessagesReturn } from "./types";

export function useMessages(): UseMessagesReturn {
  const [state, setState] = useState<MessagesState>({
    loading: false,
    messages: []
  });
  
  const { fetchMessages: fetchMessagesBase } = useFetchMessages();
  const { markMessagesAsRead: markMessagesAsReadBase } = useMarkMessagesAsRead();
  const { sendMessage: sendMessageBase } = useSendMessage();

  // Wrapper functions that pass the state setter
  const fetchMessages = async (conversationId: string) => {
    const messages = await fetchMessagesBase(conversationId, setState);
    if (messages && messages.length > 0) {
      await markMessagesAsRead(conversationId);
    }
  };

  const sendMessage = async (conversationId: string, content: string, attachments?: File[]) => {
    await sendMessageBase(conversationId, content, attachments, setState);
  };

  const markMessagesAsRead = async (conversationId: string) => {
    await markMessagesAsReadBase(conversationId, setState);
  };

  return {
    loading: state.loading,
    messages: state.messages,
    fetchMessages,
    sendMessage,
    markMessagesAsRead
  };
}
