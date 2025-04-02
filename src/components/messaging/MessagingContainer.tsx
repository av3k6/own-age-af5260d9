
import React from "react";
import { Conversation } from "@/types/message";
import { ConversationCategory } from "@/types/encryption";
import MessageArea from "@/components/messaging/MessageArea";
import ConversationListSection from "@/components/messaging/ConversationListSection";
import ErrorState from "@/components/messaging/ErrorState";
import { AlertCircle } from "lucide-react";

interface MessagingContainerProps {
  error: string | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: any[];
  loading: boolean;
  searchTerm: string;
  filters: {
    category?: ConversationCategory;
    hasUnread?: boolean;
  };
  filteredConversations: Conversation[];
  isMobile: boolean;
  showConversations: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onGoBack: () => void;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  onNewConversation: () => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category?: ConversationCategory) => void;
  onUnreadChange: (hasUnread?: boolean) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

const MessagingContainer: React.FC<MessagingContainerProps> = ({
  error,
  conversations,
  currentConversation,
  messages,
  loading,
  searchTerm,
  filters,
  filteredConversations,
  isMobile,
  showConversations,
  onSelectConversation,
  onGoBack,
  onSendMessage,
  onNewConversation,
  onSearchChange,
  onCategoryChange,
  onUnreadChange,
  onClearFilters,
  onRetry,
}) => {
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }
  
  if (!loading && conversations.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden h-[70vh] bg-background shadow-sm flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
        <p className="text-muted-foreground mb-4">
          Start a conversation to connect with other users
        </p>
        <button 
          onClick={onNewConversation}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Start a new conversation
        </button>
      </div>
    );
  }

  return (
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
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onUnreadChange={onUnreadChange}
            onClearFilters={onClearFilters}
            onSelectConversation={onSelectConversation}
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
            onGoBack={onGoBack}
            onSend={onSendMessage}
            onNewConversation={onNewConversation}
          />
        </div>
      )}
    </div>
  );
};

export default MessagingContainer;
