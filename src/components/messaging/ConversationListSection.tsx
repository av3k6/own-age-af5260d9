
import React from "react";
import { Conversation } from "@/types/message";
import { ConversationCategory } from "@/types/encryption";
import { Badge } from "@/components/ui/badge";
import ConversationList from "@/components/messaging/ConversationList";
import ConversationSearch from "@/components/messaging/ConversationSearch";

interface ConversationListSectionProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  searchTerm: string;
  selectedCategory?: ConversationCategory;
  hasUnread?: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category?: ConversationCategory) => void;
  onUnreadChange: (hasUnread?: boolean) => void;
  onClearFilters: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationListSection: React.FC<ConversationListSectionProps> = ({
  conversations,
  currentConversation,
  loading,
  searchTerm,
  selectedCategory,
  hasUnread,
  onSearchChange,
  onCategoryChange,
  onUnreadChange,
  onClearFilters,
  onSelectConversation
}) => {
  // Get conversation stats
  const getConversationStats = () => {
    const total = conversations.length;
    const unreadCount = conversations.filter(c => c.unreadCount > 0).length;
    
    return { total, unreadCount };
  };
  
  const { total, unreadCount } = getConversationStats();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {total} conversation{total !== 1 ? 's' : ''}
          </Badge>
          {unreadCount > 0 && (
            <Badge variant="default" className="text-xs bg-primary">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>
      <ConversationSearch 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        hasUnread={hasUnread}
        onUnreadChange={onUnreadChange}
        onClearFilters={onClearFilters}
      />
      <div className="flex-1 overflow-y-auto">
        <ConversationList 
          conversations={conversations}
          selectedId={currentConversation?.id}
          onSelect={onSelectConversation}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default ConversationListSection;
