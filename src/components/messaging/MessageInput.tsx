
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (content: string, attachments?: File[]) => Promise<void>;
  isLoading?: boolean;
  extraButton?: React.ReactNode;
}

const MessageInput = ({ onSend, isLoading = false, extraButton }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (message.trim() || attachments.length > 0) {
      await onSend(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray]);
    }
  };

  return (
    <div className="p-3 border-t">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="bg-muted px-2 py-1 rounded-md text-xs flex items-center"
            >
              <span className="truncate max-w-[100px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1"
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="flex space-x-2">
        {extraButton}
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className={cn(
            "min-h-[60px] resize-none",
            isLoading && "opacity-50 pointer-events-none"
          )}
          disabled={isLoading}
        />
        <Button
          type="button"
          size="icon"
          className="shrink-0"
          onClick={handleSend}
          disabled={isLoading || (!message.trim() && attachments.length === 0)}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
