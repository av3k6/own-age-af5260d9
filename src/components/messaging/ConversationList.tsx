
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { User, MoreHorizontal } from "lucide-react";
import { Conversation } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  onDelete: (conversationId: string) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
  onArchive?: (conversationId: string) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedId, 
  onSelect, 
  onDelete,
  onArchive,
  isLoading = false,
  isDeleting = false
}: ConversationListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 p-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center p-3 space-x-3 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-muted"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <User className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">No conversations yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          When you start or receive messages, they'll appear here
        </p>
      </div>
    );
  }

  // Helper function to format user ID into a readable name
  const formatUserName = (userId: string) => {
    if (!userId) return "Unknown";
    
    // If it's an email, get the part before @
    if (userId.includes('@')) {
      return userId.split('@')[0];
    }
    
    // If UUID format with dashes, use first segment or abbreviate
    if (userId.includes('-')) {
      const firstPart = userId.split('-')[0];
      return firstPart.length > 8 ? firstPart.substring(0, 8) : firstPart;
    }
    
    // For other formats, show first 8 chars if long
    return userId.length > 12 ? `${userId.substring(0, 8)}...` : userId;
  };

  return (
    <div className="flex flex-col divide-y divide-border">
      {conversations.map(conversation => {
        const isSelected = selectedId === conversation.id;
        const hasUnread = conversation.unreadCount > 0;
        
        // Format participant information in a cleaner way
        const otherParticipants = conversation.participants.filter(p => p !== conversation.participants[0]);
        const buyerId = otherParticipants[0] || "";
        const sellerId = conversation.participants[0] || "";
        
        // Format the IDs for display
        const buyerName = formatUserName(buyerId);
        const sellerName = formatUserName(sellerId);
        
        return (
          <div
            key={conversation.id}
            className={cn(
              "group flex items-start p-3 hover:bg-muted/50 transition-colors",
              hasUnread ? "bg-primary/5" : "",
              isSelected && "bg-muted/70"
            )}
          >
            <div 
              className={cn(
                "flex-1 cursor-pointer",
                isDeleting && "pointer-events-none opacity-50"
              )}
              onClick={() => onSelect(conversation)}
            >
              <div className="flex items-start">
                <div className={cn(
                  "rounded-full p-2 mr-3 mt-1",
                  hasUnread ? "bg-primary/20" : "bg-primary/10"
                )}>
                  <User className={cn(
                    "h-5 w-5",
                    hasUnread ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0 mr-2">
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "truncate max-w-[calc(100%-4rem)]",
                      hasUnread ? "font-semibold" : "font-medium"
                    )}>
                      {conversation.subject || "No subject"}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 max-w-[4rem] truncate">
                      {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    From: {buyerName}
                  </p>
                  {hasUnread && (
                    <Badge variant="default" className="mt-1 bg-primary">
                      {conversation.unreadCount} {conversation.unreadCount === 1 ? "new message" : "new messages"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Fixed position for the dropdown menu to prevent overlap */}
            <div className="self-start mt-1 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    disabled={isDeleting}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  {onArchive && (
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(conversation.id);
                      }}
                    >
                      Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conversation.id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                  {onArchive && <DropdownMenuSeparator />}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
