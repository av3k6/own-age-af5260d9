
import React, { useState } from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
import { DocumentMetadata } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Plus, Trash2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSignatureService, SignatureSigner, SignatureStatus } from '@/services/eSignature/eSignatureService';

interface RequestSignatureDialogProps extends DialogProps {
  document: DocumentMetadata;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestComplete?: () => void;
}

const RequestSignatureDialog: React.FC<RequestSignatureDialogProps> = ({
  document,
  open,
  onOpenChange,
  onRequestComplete,
  ...props
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createSignatureRequest } = useSignatureService();
  
  const [title, setTitle] = useState(document.name);
  const [message, setMessage] = useState(`Please sign this document: ${document.name}`);
  const [signers, setSigners] = useState<Array<{ name: string; email: string; }>>([
    { name: '', email: '' }
  ]);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days from now
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSigner = () => {
    setSigners([...signers, { name: '', email: '' }]);
  };

  const handleRemoveSigner = (index: number) => {
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setSigners(newSigners);
  };

  const handleSignerChange = (index: number, field: 'name' | 'email', value: string) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setSigners(newSigners);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to request signatures."
      });
      return;
    }
    
    // Validate inputs
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Missing title",
        description: "Please provide a title for the signature request."
      });
      return;
    }
    
    // Validate signers
    const validSigners = signers.filter(s => s.name.trim() && s.email.trim());
    if (validSigners.length === 0) {
      toast({
        variant: "destructive",
        title: "No signers",
        description: "Please add at least one signer."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert to proper signer format
      const signatureSigners: SignatureSigner[] = validSigners.map((s, index) => ({
        name: s.name.trim(),
        email: s.email.trim(),
        order: index + 1,
        status: SignatureStatus.PENDING
      }));
      
      // Create signature request
      await createSignatureRequest(document, signatureSigners, {
        title,
        message,
        createdBy: user.id,
        expiresAt: expirationDate?.toISOString(),
      });
      
      toast({
        title: "Signature request sent",
        description: "The signers will receive an email with instructions."
      });
      
      // Close dialog and trigger refresh if needed
      onOpenChange(false);
      if (onRequestComplete) {
        onRequestComplete();
      }
    } catch (error) {
      console.error('Error creating signature request:', error);
      toast({
        variant: "destructive",
        title: "Failed to send signature request",
        description: error instanceof Error ? error.message : "An unknown error occurred."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request Signatures</DialogTitle>
            <DialogDescription>
              Send this document for electronic signature.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Signature request title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message to the signers"
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Expires On</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expirationDate}
                    onSelect={setExpirationDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Signers</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddSigner}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Signer
                </Button>
              </div>
              
              <div className="space-y-2">
                {signers.map((signer, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      placeholder="Name"
                      value={signer.name}
                      onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={signer.email}
                      onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                      className="flex-1"
                    />
                    {signers.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveSigner(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signature
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestSignatureDialog;
