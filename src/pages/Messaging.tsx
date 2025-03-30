
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import ConversationList from "@/components/messaging/ConversationList";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { Plus, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation } from "@/types/message";

const Messaging = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
  
  // State to control the mobile view
  const [showConversations, setShowConversations] = useState(true);

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

  // When a conversation is selected on mobile, switch to the message view
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation.id);
    if (isMobile) {
      setShowConversations(false);
    }
  };

  const handleGoBackToConversations = () => {
    setShowConversations(true);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversation) return;
    
    try {
      await sendMessage(currentConversation.id, content, attachments);
      // After sending message successfully, refresh messages
      fetchMessages(currentConversation.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
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

      <div className="border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh] bg-background shadow-sm">
        {/* Conversation List - Always shown on desktop, conditionally shown on mobile */}
        {(!isMobile || (isMobile && showConversations)) && (
          <div className={`border-r ${isMobile ? 'col-span-1' : 'col-span-1'}`}>
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
        )}

        {/* Message Area - Always shown on desktop, conditionally shown on mobile */}
        {(!isMobile || (isMobile && !showConversations)) && (
          <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} flex flex-col`}>
            {currentConversation ? (
              <>
                <div className="p-3 border-b flex items-center justify-between bg-muted/30">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleGoBackToConversations} 
                      className="mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex-1">
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
                {isMobile && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleGoBackToConversations} 
                    className="mb-4 self-start"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to conversations
                  </Button>
                )}
                <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-medium text-xl">No conversation selected</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  Select a conversation from the list or create a new message to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
