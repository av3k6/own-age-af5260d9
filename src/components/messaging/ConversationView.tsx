
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Conversation } from "@/types/message";

interface ConversationViewProps {
  conversation: Conversation;
  messages: any[];
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  onGoBack: () => void;
  isMobile: boolean;
  isLoading: boolean;
}

const ConversationView = ({
  conversation,
  messages,
  onSendMessage,
  onGoBack,
  isMobile,
  isLoading
}: ConversationViewProps) => {
  return (
    <>
      <div className="p-3 border-b flex items-center justify-between bg-muted/30">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGoBack} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex-1">
          <h2 className="font-medium">
            {conversation.subject || "No subject"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {conversation.propertyId 
              ? `Property ID: ${conversation.propertyId}` 
              : "Direct message"}
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
        />
      </div>
      <MessageInput onSend={onSendMessage} isLoading={isLoading} />
    </>
  );
};

export default ConversationView;
