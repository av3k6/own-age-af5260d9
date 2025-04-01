
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { toast } from "sonner";

interface MessageInputProps {
  onSend: (message: string, attachments?: File[]) => Promise<void> | void;
  isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSend, 
  isLoading = false 
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) {
      return;
    }
    
    try {
      setSending(true);
      await onSend(message, attachments.length > 0 ? attachments : undefined);
      setMessage("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Don't clear message on error so user can try again
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check for file size limits (e.g., 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const newFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      newFiles.push(file);
    }
    
    setAttachments(prev => [...prev, ...newFiles]);
    
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const isDisabled = isLoading || sending || (!message.trim() && attachments.length === 0);

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 bg-background">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="bg-muted px-2 py-1 rounded-md flex items-center text-xs"
            >
              <span className="truncate max-w-[100px]">{file.name}</span>
              <button 
                type="button"
                onClick={() => removeAttachment(index)}
                className="ml-1 text-muted-foreground hover:text-destructive"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[80px] resize-none"
          disabled={isLoading || sending}
        />
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || sending}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={isDisabled}
            className="transition-opacity"
          >
            <Send className={`h-5 w-5 ${isDisabled ? 'opacity-50' : ''}`} />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*,application/pdf"
        />
      </div>
    </form>
  );
};

export default MessageInput;
