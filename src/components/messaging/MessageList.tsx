
import React, { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/message";
import { MessageDeliveryStatus } from "@/types/encryption";
import { CheckCircle2, Clock, AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ 
  messages, 
  isLoading = false 
}: MessageListProps) => {
  const { user } = useAuth();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-col p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-lg p-3 max-w-[80%] ${i % 2 === 0 ? 'bg-muted' : 'bg-primary/10'} animate-pulse`}>
              <div className="h-4 bg-muted-foreground/20 rounded w-24 mb-2"></div>
              <div className="space-y-1">
                <div className="h-3 bg-muted-foreground/20 rounded w-48"></div>
                <div className="h-3 bg-muted-foreground/20 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">No messages yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start the conversation by sending a message below
        </p>
      </div>
    );
  }

  const renderDeliveryStatus = (message: Message) => {
    if (!message.deliveryStatus || message.senderId !== user?.id) {
      return null;
    }

    switch(message.deliveryStatus) {
      case MessageDeliveryStatus.SENDING:
        return <Clock className="h-3 w-3 text-muted-foreground ml-1" />;
      case MessageDeliveryStatus.SENT:
        return <Check className="h-3 w-3 text-muted-foreground ml-1" />;
      case MessageDeliveryStatus.DELIVERED:
        return <CheckCircle2 className="h-3 w-3 text-primary ml-1" />;
      case MessageDeliveryStatus.READ:
        return <CheckCircle2 className="h-3 w-3 text-primary ml-1" fill="currentColor" />;
      case MessageDeliveryStatus.FAILED:
        return <AlertCircle className="h-3 w-3 text-destructive ml-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === user?.id;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={cn(
                "rounded-lg p-3 max-w-[80%]",
                isCurrentUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                message.deliveryStatus === MessageDeliveryStatus.FAILED && "bg-destructive/10"
              )}
            >
              {message.subject && (
                <div className="font-medium text-sm mb-1">
                  {message.subject}
                </div>
              )}
              <div className="break-words">{message.content}</div>
              <div className="flex items-center justify-end mt-1">
                <span className="text-xs opacity-70">
                  {format(new Date(message.createdAt), "p")}
                </span>
                {renderDeliveryStatus(message)}
              </div>
              {message.deliveryStatus === MessageDeliveryStatus.FAILED && (
                <div className="text-xs text-destructive mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Failed to send
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
