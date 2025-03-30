
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DocumentMetadata } from '@/types/document';
import { FilePenLine } from 'lucide-react';
import RequestSignatureDialog from './RequestSignatureDialog';

interface SignatureActionsProps {
  document: DocumentMetadata;
  onSignatureRequestComplete?: () => void;
}

const SignatureActions: React.FC<SignatureActionsProps> = ({ 
  document,
  onSignatureRequestComplete
}) => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsRequestDialogOpen(true)}
        className="flex items-center gap-1"
      >
        <FilePenLine className="h-4 w-4" />
        Request Signature
      </Button>
      
      <RequestSignatureDialog
        document={document}
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        onRequestComplete={onSignatureRequestComplete}
      />
    </>
  );
};

export default SignatureActions;
