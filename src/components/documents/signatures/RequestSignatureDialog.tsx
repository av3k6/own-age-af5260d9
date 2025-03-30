
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
import { Loader2, Send } from 'lucide-react';
import { useSignatureService, SignatureSigner, SignatureStatus } from '@/services/eSignature/eSignatureService';
import SignersList from './SignersList';
import ExpirationDatePicker from './ExpirationDatePicker';
import SignatureFormFields from './SignatureFormFields';

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
            <SignatureFormFields 
              title={title}
              message={message}
              onTitleChange={setTitle}
              onMessageChange={setMessage}
            />
            
            <ExpirationDatePicker 
              expirationDate={expirationDate}
              onExpirationDateChange={setExpirationDate}
            />
            
            <SignersList 
              signers={signers}
              onAddSigner={handleAddSigner}
              onRemoveSigner={handleRemoveSigner}
              onSignerChange={handleSignerChange}
            />
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
