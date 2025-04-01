
import React from "react";
import { Conversation } from "@/types/message";
import { ConversationCategory } from "@/types/encryption";
import MessageArea from "@/components/messaging/MessageArea";
import ConversationListSection from "@/components/messaging/ConversationListSection";
import ErrorState from "@/components/messaging/ErrorState";

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
