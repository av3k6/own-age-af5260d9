
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

const MessageInput = ({ onSend, isLoading = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim()) {
      await onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end w-full space-x-2">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className={cn(
          "min-h-[60px] resize-none flex-1",
          isLoading && "opacity-50 pointer-events-none"
        )}
        disabled={isLoading}
      />
      <Button
        type="button"
        size="icon"
        className="shrink-0"
        onClick={handleSend}
        disabled={isLoading || !message.trim()}
      >
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MessageInput;
