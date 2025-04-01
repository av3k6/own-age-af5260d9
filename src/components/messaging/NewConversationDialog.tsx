
import React, { useState } from "react";
import { ConversationCategory } from "@/types/encryption";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConversation: (
    receiverId: string,
    subject: string,
    initialMessage: string,
    propertyId: string,
    category: ConversationCategory
  ) => Promise<void>;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  open,
  onOpenChange,
  onCreateConversation
}) => {
  const [receiverId, setReceiverId] = useState("");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [category, setCategory] = useState<ConversationCategory>(ConversationCategory.GENERAL);

  const handleCreateConversation = async () => {
    if (!receiverId.trim()) {
      return;
    }
    
    await onCreateConversation(
      receiverId,
      subject || "New conversation",
      initialMessage,
      propertyId,
      category
    );
    
    // Reset form
    setReceiverId("");
    setSubject("");
    setInitialMessage("");
    setPropertyId("");
    setCategory(ConversationCategory.GENERAL);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
          <DialogDescription>
            Enter the recipient's user ID and an optional subject and initial message.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="receiverId" className="text-right">
              Recipient ID
            </Label>
            <Input
              id="receiverId"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="col-span-3"
              placeholder="Enter recipient's user ID"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
              placeholder="Optional subject"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="propertyId" className="text-right">
              Property ID
            </Label>
            <Input
              id="propertyId"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              className="col-span-3"
              placeholder="Optional property ID"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as ConversationCategory)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ConversationCategory.GENERAL}>General</SelectItem>
                <SelectItem value={ConversationCategory.PROPERTY}>Property</SelectItem>
                <SelectItem value={ConversationCategory.OFFER}>Offer</SelectItem>
                <SelectItem value={ConversationCategory.DOCUMENT}>Document</SelectItem>
                <SelectItem value={ConversationCategory.SUPPORT}>Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message" className="text-right">
              Message
            </Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="col-span-3"
              placeholder="Type your first message"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateConversation}>
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
