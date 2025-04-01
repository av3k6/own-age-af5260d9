
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewConversationDialogProps {
  onCreateConversation: (
    receiverId: string,
    subject: string,
    initialMessage: string,
    propertyId: string
  ) => Promise<void>;
}

const NewConversationDialog = ({ onCreateConversation }: NewConversationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [propertyId, setPropertyId] = useState("");

  const handleCreateConversation = async () => {
    if (!receiverId.trim()) {
      toast.error("Recipient ID is required");
      return;
    }

    try {
      await onCreateConversation(
        receiverId,
        subject || "New conversation",
        initialMessage,
        propertyId
      );
      
      // Reset form and close dialog
      setReceiverId("");
      setSubject("");
      setInitialMessage("");
      setPropertyId("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> 
          New Message
        </Button>
      </DialogTrigger>
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
