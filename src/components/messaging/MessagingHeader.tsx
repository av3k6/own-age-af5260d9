
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagingHeaderProps {
  onNewMessage: () => void;
}

const MessagingHeader: React.FC<MessagingHeaderProps> = ({ onNewMessage }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <Button 
        className="flex items-center gap-2"
        onClick={onNewMessage}
      >
        <Plus className="h-4 w-4" /> 
        New Message
      </Button>
    </div>
  );
};

export default MessagingHeader;
