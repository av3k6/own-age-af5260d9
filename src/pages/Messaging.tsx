import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import ConversationList from "@/components/messaging/ConversationList";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { Plus, MessageSquare, ArrowLeft, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Conversation } from "@/types/message";
import { toast } from "sonner";
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

const Messaging = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    loading,
    conversations,
    messages,
    currentConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    setCurrentConversation,
    deleteConversation,
    deleting
  } = useMessaging();
  
  const [showConversations, setShowConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [receiverId, setReceiverId] = useState("");
  const [subject, setSubject] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [propertyId, setPropertyId] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchConversations().catch(err => {
        console.error("Error fetching conversations:", err);
        setError("Could not load your conversations. Please try again later.");
        toast.error("Could not load conversations", {
          description: "Please try again later"
        });
      });
    }
  }, [user]);

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    fetchMessages(conversation);
    if (isMobile) {
      setShowConversations(false);
    }
    setError(null);
  };

  const handleGoBackToConversations = () => {
    setShowConversations(true);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!currentConversation) return;
    
    try {
      await sendMessage(currentConversation.id, content, attachments);
      setError(null);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message", {
        description: "Please try again later"
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation", {
        description: "Please try again later"
      });
    }
  };

  const handleCreateNewConversation = async () => {
    if (!receiverId.trim()) {
      toast.error("Recipient ID is required");
      return;
    }

    try {
      const newConversation = await createConversation(
        receiverId,
        subject || "New conversation",
        initialMessage,
        propertyId || undefined
      );
      
      if (newConversation) {
        setNewConversationOpen(false);
        setReceiverId("");
        setSubject("");
        setInitialMessage("");
        setPropertyId("");
        handleSelectConversation(newConversation);
        toast.success("Conversation created successfully");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation");
    }
  };

  const handleRetry = () => {
    setError(null);
    if (user) {
      fetchConversations().catch(err => {
        console.error("Error retrying conversation fetch:", err);
        setError("Could not load your conversations. Please try again later.");
      });
    }
  };

  if (authLoading) {
    return (
      <div className="container py-10">
        <div className="w-full h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Dialog open={newConversationOpen} onOpenChange={setNewConversationOpen}>
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
              <Button onClick={handleCreateNewConversation}>
                Start Conversation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error ? (
        <div className="border rounded-lg p-6 bg-destructive/10 text-center">
          <AlertCircle className="h-10 w-10 mx-auto mb-2 text-destructive" />
          <h3 className="font-semibold mb-2">{error}</h3>
          <Button onClick={handleRetry} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[70vh] bg-background shadow-sm">
          {(!isMobile || (isMobile && showConversations)) && (
            <div className={`border-r ${isMobile ? 'col-span-1' : 'col-span-1'}`}>
              <div className="p-3 border-b bg-muted/30">
                <h2 className="font-medium text-lg">Conversations</h2>
              </div>
              <ConversationList 
                conversations={conversations}
                selectedId={currentConversation?.id}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
                isLoading={loading}
                isDeleting={deleting}
              />
            </div>
          )}

          {(!isMobile || (isMobile && !showConversations)) && (
            <div className={`${isMobile ? 'col-span-1' : 'col-span-2'} flex flex-col`}>
              {currentConversation ? (
                <>
                  <div className="p-3 border-b flex items-center justify-between bg-muted/30">
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleGoBackToConversations} 
                        className="mr-2"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <div className="flex-1">
                      <h2 className="font-medium">
                        {currentConversation.subject || "No subject"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {currentConversation.propertyId 
                          ? `Property ID: ${currentConversation.propertyId}` 
                          : "Direct message"}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <MessageList 
                      messages={messages} 
                      isLoading={loading}
                    />
                  </div>
                  <MessageInput onSend={handleSendMessage} isLoading={loading} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleGoBackToConversations} 
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
                    onClick={() => setNewConversationOpen(true)}
                  >
                    <Users className="h-4 w-4" />
                    Start New Conversation
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messaging;
