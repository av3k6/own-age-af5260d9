
import React, { useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Import components and types
import { SignerType, SignatureFormData } from './types/signatureTypes';
import { signatureFormSchema } from './schema/signatureFormSchema';
import { useSignatureRequest } from './hooks/useSignatureRequest';
import SignatureFormFields from './SignatureFormFields';
import ExpirationDatePicker from './ExpirationDatePicker';
import SignersList from './SignersList';

type SignatureFormValues = SignatureFormData;

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
  const { createSignatureRequest } = useSignatureRequest();
  
  // Create a properly typed empty signer for reuse
  const emptySigner: SignerType = { name: '', email: '' };
  
  // Setup react-hook-form with zod resolver for validation
  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors }
  } = useForm<SignatureFormValues>({
    resolver: zodResolver(signatureFormSchema),
    defaultValues: {
      title: document.name,
      message: `Please sign this document: ${document.name}`,
      signers: [{ ...emptySigner }],
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default: 30 days from now
    },
  });
  
  // Watch form values for controlled components
  const title = watch('title');
  const message = watch('message');
  const expirationDate = watch('expirationDate');
  const signers = watch('signers');

  // Handle signers management
  const handleAddSigner = () => {
    setValue('signers', [...signers, { ...emptySigner }]);
  };

  const handleRemoveSigner = (index: number) => {
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setValue('signers', newSigners);
  };

  const handleSignerChange = (index: number, field: keyof SignerType, value: string) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setValue('signers', newSigners);
  };

  // Handle form field changes
  const handleTitleChange = (value: string) => {
    setValue('title', value);
  };

  const handleMessageChange = (value: string) => {
    setValue('message', value);
  };

  const handleExpirationDateChange = (date: Date | undefined) => {
    setValue('expirationDate', date);
  };

  // Handle form submission
  const onSubmit = async (data: SignatureFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to request signatures."
      });
      return;
    }
    
    try {
      await createSignatureRequest(document, data, user.id);
      
      toast({
        title: "Signature request sent",
        description: "The signers will receive an email with instructions."
      });
      
      // Reset form and close dialog
      reset();
      onOpenChange(false);
      
      // Trigger refresh if needed
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
    }
  };
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Small delay to avoid flashing the reset form before dialog closes
      const timer = setTimeout(() => reset(), 300);
      return () => clearTimeout(timer);
    } else {
      // Set initial values when dialog opens
      reset({
        title: document.name,
        message: `Please sign this document: ${document.name}`,
        signers: [{ ...emptySigner }],
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
    }
  }, [open, document.name, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Request Signatures</DialogTitle>
            <DialogDescription>
              Send this document for electronic signature.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Title and Message fields */}
            <SignatureFormFields
              title={title}
              message={message}
              onTitleChange={handleTitleChange}
              onMessageChange={handleMessageChange}
            />
            
            {/* Expiration Date */}
            <ExpirationDatePicker
              expirationDate={expirationDate}
              onExpirationDateChange={handleExpirationDateChange}
            />
            
            {/* Signers List */}
            <SignersList
              signers={signers}
              onAddSigner={handleAddSigner}
              onRemoveSigner={handleRemoveSigner}
              onSignerChange={handleSignerChange}
            />
            
            {/* Display validation errors */}
            {errors.signers && (
              <p className="text-sm font-medium text-destructive">
                {errors.signers.message}
              </p>
            )}
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
