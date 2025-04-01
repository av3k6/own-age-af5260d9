
import React, { useRef, useState } from "react";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Conversation, Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Separator } from "@/components/ui/separator";

interface ConversationViewProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  isMobile?: boolean;
  onGoBack?: () => void;
  isLoading?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversation,
  messages,
  onSendMessage,
  isMobile = false,
  onGoBack,
  isLoading = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    
    try {
      setIsSending(true);
      await onSendMessage(content, attachments);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Extract and format participant information
  const otherParticipant = conversation.participants.find(p => p !== conversation.participants[0]) || "";
  const seller = conversation.participants[0] || "";
  
  // Format the IDs for display
  const buyerName = otherParticipant.includes('@') 
    ? otherParticipant.split('@')[0] 
    : otherParticipant.split('-')[0] || "Buyer";
    
  const sellerName = seller.includes('@') 
    ? seller.split('@')[0] 
    : seller.split('-')[0] || "Seller";

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3 flex items-center bg-muted/30">
        {isMobile && onGoBack && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onGoBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{conversation.subject || "No Subject"}</h2>
          <div className="text-sm text-muted-foreground mt-0.5">
            From: {buyerName} • To: {sellerName}
          </div>
          {conversation.propertyId && (
            <div className="text-sm text-muted-foreground mt-0.5">
              Property ID: {conversation.propertyId}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col h-full">
        <div className="flex-1 overflow-auto">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="p-2 border-t">
            <p className="text-sm font-medium mb-2">Attachments:</p>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="bg-muted rounded-md p-2 text-xs flex items-center">
                  <span className="truncate max-w-[100px]">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                  >
                    <span className="sr-only">Remove</span>
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t mt-auto">
          <MessageInput
            onSend={handleSendMessage}
            isLoading={isSending}
            extraButton={
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-5 w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
