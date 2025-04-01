
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { Conversation } from "@/types/message";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
  isLoading?: boolean;
}

const ConversationList = ({ 
  conversations, 
  selectedId, 
  onSelect, 
  isLoading = false 
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
        <p className="text-muted-foreground text-sm mt-1">
          When you start or receive messages, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {conversations.map(conversation => {
        const isSelected = selectedId === conversation.id;
        const hasUnread = conversation.unreadCount > 0;
        
        return (
          <div
            key={conversation.id}
            className={cn(
              "flex items-start p-3 cursor-pointer transition-colors",
              hasUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
              isSelected && "bg-muted/70"
            )}
            onClick={() => onSelect(conversation)}
          >
            <div className={cn(
              "rounded-full p-2 mr-3 mt-1",
              hasUnread ? "bg-primary/20" : "bg-primary/10"
            )}>
              <User className={cn(
                "h-5 w-5",
                hasUnread ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className={cn(
                  "truncate",
                  hasUnread ? "font-semibold" : "font-medium"
                )}>
                  {conversation.subject || "No subject"}
                </h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {conversation.propertyId && (
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {conversation.propertyId}
                  </span>
                )}
                {conversation.category && (
                  <Badge variant="outline" className="text-xs">
                    {conversation.category}
                  </Badge>
                )}
                {conversation.isEncrypted && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    Encrypted
                  </Badge>
                )}
              </div>
              {hasUnread && (
                <Badge variant="default" className="mt-1 bg-primary">
                  {conversation.unreadCount} {conversation.unreadCount === 1 ? "new message" : "new messages"}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
