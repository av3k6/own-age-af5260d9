
import React from 'react';
import { SignatureStatus, SignatureProvider } from '@/services/eSignature/eSignatureService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, X, Check, Clock } from 'lucide-react';
import SignatureBadge from './SignatureBadge';

interface Signer {
  name: string;
  email: string;
  status: SignatureStatus;
}

interface Document {
  name: string;
}

interface SignatureRequest {
  id: string;
  title: string;
  status: SignatureStatus;
  created_at?: string;
  document?: Document;
  message?: string;
  signers?: Signer[];
  provider: string;
}

interface SignatureRequestCardProps {
  request: SignatureRequest;
  onCancel: (requestId: string, provider: string) => void;
  actionInProgress: string | null;
}

const SignatureRequestCard: React.FC<SignatureRequestCardProps> = ({
  request,
  onCancel,
  actionInProgress
}) => {
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card key={request.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{request.title}</CardTitle>
            <CardDescription>Created on {formatDate(request.created_at)}</CardDescription>
          </div>
          <SignatureBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="font-medium">Document:</span> {request.document?.name || 'Unknown document'}
          </div>
          
          {request.message && (
            <div className="text-sm">
              <span className="font-medium">Message:</span> {request.message}
            </div>
          )}
          
          <div className="mt-2">
            <h4 className="font-medium text-sm mb-2">Signers:</h4>
            <div className="space-y-2">
              {request.signers?.map((signer: Signer, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 border rounded-md">
                  <div>
                    <span>{signer.name}</span>
                    <span className="text-muted-foreground ml-2">({signer.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {signer.status === SignatureStatus.SIGNED && (
                      <span className="flex items-center text-green-600">
                        <Check className="h-3 w-3 mr-1" /> Signed
                      </span>
                    )}
                    {signer.status === SignatureStatus.PENDING && (
                      <span className="flex items-center text-amber-600">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </span>
                    )}
                    {signer.status === SignatureStatus.DECLINED && (
                      <span className="flex items-center text-red-600">
                        <X className="h-3 w-3 mr-1" /> Declined
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            {(request.status === SignatureStatus.PENDING) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancel(request.id, request.provider)}
                disabled={actionInProgress === request.id}
              >
                {actionInProgress === request.id ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Cancel Request
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureRequestCard;
