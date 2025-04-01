
import React from "react";
import { MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyConversationStateProps {
  onNewConversation: () => void;
  isMobile: boolean;
  onGoBack?: () => void;
}

const EmptyConversationState = ({ 
  onNewConversation, 
  isMobile, 
  onGoBack 
}: EmptyConversationStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      {isMobile && onGoBack && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onGoBack} 
          className="mb-4 self-start"
        >
          <span className="sr-only">Back to conversations</span>
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
};

export default EmptyConversationState;
