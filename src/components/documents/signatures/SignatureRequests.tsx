
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSignatureService, SignatureStatus, SignatureProvider } from '@/services/eSignature/eSignatureService';
import SignatureRequestCard from './SignatureRequestCard';
import EmptySignatureState from './EmptySignatureState';
import SignatureRequestsLoading from './SignatureRequestsLoading';

const SignatureRequests: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getSignatureRequests, cancelSignatureRequest } = useSignatureService();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await getSignatureRequests(user.id);
        setRequests(data || []);
      } catch (error) {
        console.error('Error loading signature requests:', error);
        toast({
          variant: "destructive",
          title: "Failed to load signature requests",
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
  }, [user, getSignatureRequests, toast]);
  
  const handleCancelRequest = async (requestId: string, provider: string) => {
    if (!user) return;
    
    try {
      setActionInProgress(requestId);
      await cancelSignatureRequest(requestId, provider as SignatureProvider);
      
      // Update local state after cancellation
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId 
            ? { ...req, status: SignatureStatus.DECLINED } 
            : req
        )
      );
      
      toast({
        title: "Signature request cancelled",
        description: "All signers will be notified."
      });
    } catch (error) {
      console.error('Error cancelling signature request:', error);
      toast({
        variant: "destructive",
        title: "Failed to cancel signature request",
        description: error instanceof Error ? error.message : "An unknown error occurred."
      });
    } finally {
      setActionInProgress(null);
    }
  };
  
  if (isLoading) {
    return <SignatureRequestsLoading />;
  }
  
  if (requests.length === 0) {
    return <EmptySignatureState />;
  }
  
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <SignatureRequestCard
          key={request.id}
          request={request}
          onCancel={handleCancelRequest}
          actionInProgress={actionInProgress}
        />
      ))}
    </div>
  );
};

export default SignatureRequests;
