
import React from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/message";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { MessageDeliveryStatus } from "@/types/encryption";

interface MessageAreaProps {
  currentConversation: Conversation | null;
  messages: any[];
  loading: boolean;
  isMobile: boolean;
  onGoBack: () => void;
  onSend: (content: string, attachments?: File[]) => Promise<void>;
  onNewConversation: () => void;
}

const MessageArea = ({
  currentConversation,
  messages,
  loading,
  isMobile,
  onGoBack,
  onSend,
  onNewConversation
}: MessageAreaProps) => {
  if (!currentConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="text-center text-muted-foreground p-6">
          <p className="mb-4">Select a conversation to start messaging</p>
          <Button onClick={onNewConversation}>Start a new conversation</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with conversation details */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={onGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <div>
            <div className="font-medium flex items-center">
              {currentConversation.subject || "No subject"}
              {currentConversation.isEncrypted && (
                <Lock className="h-3 w-3 ml-2 text-blue-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentConversation.category && (
                <span className="mr-2 bg-muted rounded-full px-2 py-0.5 text-xs">
                  {currentConversation.category}
                </span>
              )}
              {currentConversation.propertyId && (
                <span>Property: {currentConversation.propertyId}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={loading} />
      </div>

      {/* Message input */}
      <MessageInput onSend={onSend} isLoading={loading} />
    </div>
  );
};

export default MessageArea;
