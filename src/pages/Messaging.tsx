
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { useMessageSearch } from "@/hooks/messaging/useMessageSearch";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation } from "@/types/message";
import { toast } from "sonner";
import { ConversationCategory } from "@/types/encryption";

// Import our new components
import MessageArea from "@/components/messaging/MessageArea";
import ConversationListSection from "@/components/messaging/ConversationListSection";
import NewConversationDialog from "@/components/messaging/NewConversationDialog";
import ErrorState from "@/components/messaging/ErrorState";

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
      // Clear any previous errors
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
        // Close dialog
        setNewConversationOpen(false);
        
        // Select the new conversation
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
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setNewConversationOpen(true)}
        >
          <Plus className="h-4 w-4" /> 
          New Message
        </Button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : (
        <div className="border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh] bg-background shadow-sm">
          {/* Conversation List - Always shown on desktop, conditionally shown on mobile */}
          {(!isMobile || (isMobile && showConversations)) && (
            <div className={`border-r ${isMobile ? 'col-span-1' : 'col-span-1'}`}>
              <ConversationListSection 
                conversations={filteredConversations}
                currentConversation={currentConversation}
                loading={loading}
                searchTerm={searchTerm}
                selectedCategory={filters.category}
                hasUnread={filters.hasUnread}
                onSearchChange={setSearchTerm}
                onCategoryChange={setSearchCategory}
                onUnreadChange={setHasUnread}
                onClearFilters={clearFilters}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          )}

          {/* Message Area - Always shown on desktop, conditionally shown on mobile */}
          {(!isMobile || (isMobile && !showConversations)) && (
            <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} flex flex-col`}>
              <MessageArea 
                currentConversation={currentConversation}
                messages={messages}
                loading={loading}
                isMobile={isMobile}
                onGoBack={handleGoBackToConversations}
                onSend={handleSendMessage}
                onNewConversation={() => setNewConversationOpen(true)}
              />
            </div>
          )}
        </div>
      )}
      
      <NewConversationDialog 
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        onCreateConversation={handleCreateNewConversation}
      />
    </div>
  );
};

export default Messaging;
