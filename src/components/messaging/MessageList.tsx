
import React, { useEffect, useRef } from "react";
import { formatRelative } from "date-fns";
import { Check, Clock, Lock, Paperclip, Shield, User, X } from "lucide-react";
import { Message } from "@/types/message";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { MessageDeliveryStatus } from "@/types/encryption";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getStatusIcon = (status?: MessageDeliveryStatus, isEncrypted?: boolean) => {
    switch (status) {
      case MessageDeliveryStatus.SENDING:
        return <Clock className="h-3 w-3 ml-1" />;
      case MessageDeliveryStatus.SENT:
        return <Check className="h-3 w-3 ml-1" />;
      case MessageDeliveryStatus.DELIVERED:
        return <Check className="h-3 w-3 ml-1" />;
      case MessageDeliveryStatus.READ:
        return <Check className="h-3 w-3 ml-1 text-blue-500" />;
      case MessageDeliveryStatus.FAILED:
        return <X className="h-3 w-3 ml-1 text-destructive" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start space-x-2 animate-pulse">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <User className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium text-lg">No messages</h3>
        <p className="text-muted-foreground text-sm mt-1">
          Send a message to start the conversation
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      {messages.map(message => {
        const isCurrentUser = user?.id === message.senderId;
        const isEncrypted = !!message.encryptedContent;
        
        return (
          <div 
            key={message.id} 
            className={cn(
              "flex space-x-2",
              isCurrentUser ? "justify-end" : "justify-start"
            )}
          >
            {!isCurrentUser && (
              <div className="rounded-full bg-muted p-2 h-8 w-8 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
            
            <div className={cn(
              "max-w-[70%] rounded-lg p-3",
              isCurrentUser 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted"
            )}>
              <div className="text-sm mb-1">
                {message.content}
              </div>
              
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map(attachment => (
                    <a 
                      key={attachment.id}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs underline hover:text-blue-500"
                    >
                      <Paperclip className="h-3 w-3 mr-1" />
                      {attachment.name}
                    </a>
                  ))}
                </div>
              )}
              
              <div className={cn(
                "text-xs mt-1 flex items-center",
                isCurrentUser 
                  ? "text-primary-foreground/80" 
                  : "text-muted-foreground"
              )}>
                <span className="flex-grow">
                  {formatRelative(new Date(message.createdAt), new Date())}
                </span>
                
                {isEncrypted && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Lock className="h-3 w-3 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>End-to-end encrypted</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                {isCurrentUser && (
                  <span className="ml-1">{getStatusIcon(message.deliveryStatus, isEncrypted)}</span>
                )}
              </div>
            </div>
            
            {isCurrentUser && message.deliveryStatus === MessageDeliveryStatus.FAILED && (
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <X className="h-4 w-4 text-destructive" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Failed to send message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
