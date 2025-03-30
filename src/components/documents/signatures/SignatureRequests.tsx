
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSignatureService, SignatureStatus } from '@/services/eSignature/eSignatureService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Mail, Clock } from 'lucide-react';

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
      await cancelSignatureRequest(requestId, provider);
      
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
  
  // Helper to format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Helper to get status badge
  const getStatusBadge = (status: SignatureStatus) => {
    switch (status) {
      case SignatureStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case SignatureStatus.SIGNED:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Signed</Badge>;
      case SignatureStatus.COMPLETED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case SignatureStatus.DECLINED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      case SignatureStatus.EXPIRED:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (requests.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/30">
        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">No signature requests</h3>
        <p className="text-muted-foreground">
          You haven't sent any document signature requests yet.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{request.title}</CardTitle>
                <CardDescription>Created on {formatDate(request.created_at)}</CardDescription>
              </div>
              {getStatusBadge(request.status)}
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
                  {request.signers?.map((signer: any, index: number) => (
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
                    onClick={() => handleCancelRequest(request.id, request.provider)}
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
      ))}
    </div>
  );
};

export default SignatureRequests;
