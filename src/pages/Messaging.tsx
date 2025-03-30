
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import ConversationList from "@/components/messaging/ConversationList";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { Plus, LucideMessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Messaging = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    setCurrentConversation
  } = useMessaging();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const handleSelectConversation = (conversation: any) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversation) return;
    await sendMessage(currentConversation.id, content, attachments);
  };

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="w-full h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          New Message
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden grid grid-cols-3 h-[70vh] bg-background shadow-sm">
        {/* Conversation List */}
        <div className="border-r col-span-1">
          <div className="p-3 border-b bg-muted/30">
            <h2 className="font-medium text-lg">Conversations</h2>
          </div>
          <ConversationList 
            conversations={conversations}
            selectedId={currentConversation?.id}
            onSelect={handleSelectConversation}
            isLoading={loading}
          />
        </div>

        {/* Message Area */}
        <div className="col-span-2 flex flex-col">
          {currentConversation ? (
            <>
              <div className="p-3 border-b flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="font-medium">
                    {currentConversation.subject || "No subject"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation.propertyId 
                      ? `Property ID: ${currentConversation.propertyId}` 
                      : "Direct message"}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <MessageList messages={messages} isLoading={loading} />
              </div>
              <MessageInput onSend={handleSendMessage} isLoading={loading} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <LucideMessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="font-medium text-xl">No conversation selected</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                Select a conversation from the list or create a new message to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messaging;
