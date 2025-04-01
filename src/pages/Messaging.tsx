
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { useMessageSearch } from "@/hooks/messaging/useMessageSearch";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation } from "@/types/message";
import { toast } from "sonner";
import { ConversationCategory } from "@/types/encryption";

// Import our components
import MessagingHeader from "@/components/messaging/MessagingHeader";
import MessagingContainer from "@/components/messaging/MessagingContainer";
import MessagingLoading from "@/components/messaging/MessagingLoading";
import NewConversationDialog from "@/components/messaging/NewConversationDialog";

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
    setCurrentConversation
  } = useMessaging();
  
  // State to control the mobile view
  const [showConversations, setShowConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  
  // Use the message search hook
  const {
    searchTerm,
    filters,
    filteredConversations,
    setSearchTerm,
    setCategory: setSearchCategory,
    setHasUnread,
    clearFilters
  } = useMessageSearch(conversations);

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

  // When a conversation is selected on mobile, switch to the message view
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation);
    if (isMobile) {
      setShowConversations(false);
    }
    // Clear any previous errors when selecting a conversation
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

  const handleCreateNewConversation = async (
    receiverId: string,
    subject: string,
    initialMessage: string,
    propertyId: string,
    category: ConversationCategory
  ) => {
    if (!receiverId.trim()) {
      toast.error("Recipient ID is required");
      return;
    }

    try {
      const newConversation = await createConversation(
        receiverId,
        subject,
        initialMessage,
        propertyId || undefined,
        category
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
    return <MessagingLoading />;
  }

  return (
    <div className="container py-6 max-w-6xl">
      <MessagingHeader onNewMessage={() => setNewConversationOpen(true)} />
      
      <MessagingContainer 
        error={error}
        conversations={conversations}
        currentConversation={currentConversation}
        messages={messages}
        loading={loading}
        searchTerm={searchTerm}
        filters={filters}
        filteredConversations={filteredConversations}
        isMobile={isMobile}
        showConversations={showConversations}
        onSelectConversation={handleSelectConversation}
        onGoBack={handleGoBackToConversations}
        onSendMessage={handleSendMessage}
        onNewConversation={() => setNewConversationOpen(true)}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSearchCategory}
        onUnreadChange={setHasUnread}
        onClearFilters={clearFilters}
        onRetry={handleRetry}
      />
      
      <NewConversationDialog 
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        onCreateConversation={handleCreateNewConversation}
      />
    </div>
  );
};

export default Messaging;
