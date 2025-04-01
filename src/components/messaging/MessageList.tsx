
import React from "react";
import { Message } from "@/types/message";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const MessageList = ({ messages, isLoading = false }: MessageListProps) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[80%] animate-pulse ${
                i % 2 === 0 ? "bg-muted" : "bg-muted"
              }`}
              style={{ width: `${Math.random() * 40 + 40}%`, height: "60px" }}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-muted-foreground">No messages yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Send a message to start the conversation
          </p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const messagesByDate: Record<string, Message[]> = {};
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });

  return (
    <div className="flex flex-col space-y-4 p-4">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="flex justify-center">
            <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
              {new Date(date).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {dateMessages.map((message) => {
            const isOwn = message.senderId === user?.id;
            
            return (
              <div key={message.id} className={cn(
                "flex flex-col max-w-[85%]",
                isOwn ? "self-end items-end" : "self-start items-start"
              )}>
                <div className={cn(
                  "rounded-lg p-3 shadow-sm",
                  isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  isOwn ? "text-right text-muted-foreground" : "text-muted-foreground"
                )}>
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
