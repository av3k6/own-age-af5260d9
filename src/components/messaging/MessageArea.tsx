
import React from "react";
import { ArrowLeft, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { Conversation, Message } from "@/types/message";

interface MessageAreaProps {
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  isMobile: boolean;
  onGoBack: () => void;
  onSend: (content: string, attachments?: File[]) => Promise<void>;
  onNewConversation: () => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  currentConversation,
  messages,
  loading,
  isMobile,
  onGoBack,
  onSend,
  onNewConversation
}) => {
  if (!currentConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onGoBack} 
            className="mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to conversations
          </Button>
        )}
        <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-medium text-xl">No conversation selected</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          Select a conversation from the list or create a new message to get started
        </p>
        <Button 
          className="mt-4 flex items-center gap-2"
          onClick={onNewConversation}
        >
          <Users className="h-4 w-4" />
          Start New Conversation
        </Button>
      </div>
    );
  }
  
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
            {currentConversation.subject || "No subject"}
          </h2>
          <div className="flex items-center text-xs text-muted-foreground">
            {currentConversation.propertyId && (
              <span className="mr-2">Property ID: {currentConversation.propertyId}</span>
            )}
            {currentConversation.category && (
              <Badge variant="outline" className="text-xs">
                {currentConversation.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={loading} />
      </div>
      <MessageInput onSend={onSend} isLoading={loading} />
    </>
  );
};

export default MessageArea;
