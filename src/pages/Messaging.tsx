
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import ConversationList from "@/components/messaging/ConversationList";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation } from "@/types/message";
import { toast } from "sonner";
import NewConversationDialog from "@/components/messaging/NewConversationDialog";
import EmptyConversationState from "@/components/messaging/EmptyConversationState";
import ErrorState from "@/components/messaging/ErrorState";
import ConversationView from "@/components/messaging/ConversationView";

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
    createConversation,
    setCurrentConversation,
    deleteConversation,
    deleting
  } = useMessaging();
  
  const [showConversations, setShowConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchConversations().catch(err => {
        console.error("Error fetching conversations:", err);
        setError("Could not load your conversations. Please try again later.");
        toast.error("Could not load conversations", {
          description: "Please try again later"
        });
      });
    }
  }, [user]);

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation);
    if (isMobile) {
      setShowConversations(false);
    }
    setError(null);
  };

  const handleGoBackToConversations = () => {
    setShowConversations(true);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversation) return;
    
    try {
      await sendMessage(currentConversation.id, content, attachments);
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later"
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation", {
        description: "Please try again later"
      });
    }
  };

  const handleArchiveConversation = (conversationId: string) => {
    // This is just a placeholder for now
    toast.info("Archive functionality coming soon", {
      description: "This feature is not yet implemented"
    });
  };

  const handleCreateNewConversation = async (
    receiverId: string,
    subject: string,
    initialMessage: string,
    propertyId: string
  ) => {
    try {
      const newConversation = await createConversation(
        receiverId,
        subject || "New conversation",
        initialMessage,
        propertyId || undefined
      );
      
      if (newConversation) {
        setNewConversationOpen(false);
        handleSelectConversation(newConversation);
        toast.success("Conversation created successfully");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
    }
  };

  const handleRetry = () => {
    setError(null);
    if (user) {
      fetchConversations().catch(err => {
        console.error("Error retrying conversation fetch:", err);
        setError("Could not load your conversations. Please try again later.");
      });
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
        <NewConversationDialog onCreateConversation={handleCreateNewConversation} />
      </div>

      {error ? (
        <ErrorState error={error} onRetry={handleRetry} />
      ) : (
        <div className="border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh] bg-background shadow-sm">
          {(!isMobile || (isMobile && showConversations)) && (
            <div className={`border-r ${isMobile ? 'col-span-1' : 'col-span-1'}`}>
              <div className="p-3 border-b bg-muted/30">
                <h2 className="font-medium text-lg">Conversations</h2>
              </div>
              <ConversationList 
                conversations={conversations}
                selectedId={currentConversation?.id}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
                onArchive={handleArchiveConversation}
                isLoading={loading}
                isDeleting={deleting}
              />
            </div>
          )}

          {(!isMobile || (isMobile && !showConversations)) && (
            <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} flex flex-col`}>
              {currentConversation ? (
                <ConversationView
                  conversation={currentConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onGoBack={handleGoBackToConversations}
                  isMobile={isMobile}
                  isLoading={loading}
                />
              ) : (
                <EmptyConversationState
                  onNewConversation={() => setNewConversationOpen(true)}
                  isMobile={isMobile}
                  onGoBack={handleGoBackToConversations}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messaging;
