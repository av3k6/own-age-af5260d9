
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignatureService, SignatureSigner, SignatureStatus } from '@/services/eSignature/eSignatureService';

// Import the components we've created
import SignatureFormFields from './SignatureFormFields';
import ExpirationDatePicker from './ExpirationDatePicker';
import SignersList from './SignersList';

// Form validation schema using Zod
const signatureFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string(),
  expirationDate: z.date().optional(),
  signers: z.array(
    z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Valid email is required'),
    })
  ).min(1, 'At least one signer is required'),
});

type SignatureFormValues = z.infer<typeof signatureFormSchema>;

// Define a type for our signers that matches what our form expects
type SignerType = {
  name: string;
  email: string;
};

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
      signers: [{ name: '', email: '' }],
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
    // Ensure we're adding an object that matches the required type
    setValue('signers', [...signers, { name: '', email: '' }]);
  };

  const handleRemoveSigner = (index: number) => {
    const newSigners = [...signers];
    newSigners.splice(index, 1);
    setValue('signers', newSigners);
  };

  const handleSignerChange = (index: number, field: 'name' | 'email', value: string) => {
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
      // Convert to proper signer format
      const signatureSigners: SignatureSigner[] = data.signers.map((s, index) => ({
        name: s.name.trim(),
        email: s.email.trim(),
        order: index + 1,
        status: SignatureStatus.PENDING
      }));
      
      // Create signature request
      await createSignatureRequest(document, signatureSigners, {
        title: data.title,
        message: data.message,
        createdBy: user.id,
        expiresAt: data.expirationDate?.toISOString(),
      });
      
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
  React.useEffect(() => {
    if (!open) {
      // Small delay to avoid flashing the reset form before dialog closes
      const timer = setTimeout(() => reset(), 300);
      return () => clearTimeout(timer);
    } else {
      // Set initial values when dialog opens with properly typed empty values
      reset({
        title: document.name,
        message: `Please sign this document: ${document.name}`,
        signers: [{ name: '', email: '' }] as SignerType[], // explicitly typed as SignerType[]
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
