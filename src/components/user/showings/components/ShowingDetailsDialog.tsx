
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/formatters";
import { ViewingRequest } from "@/types/showing";
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ShowingDetailsDialogProps {
  showing: ViewingRequest;
  isBuyer: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => Promise<void>;
}

export default function ShowingDetailsDialog({
  showing,
  isBuyer,
  onClose,
  onStatusChange
}: ShowingDetailsDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sellerNotes, setSellerNotes] = useState(showing.sellerNotes || "");
  const { toast } = useToast();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleStatusChange = async (status: string) => {
    if (!onStatusChange) return;
    
    setIsLoading(true);
    
    try {
      await onStatusChange(showing.id, status);
      toast({
        title: "Status Updated",
        description: `Showing request has been ${status.toLowerCase()}.`,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update showing status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return "outline";
      case 'APPROVED': return "default"; // Changed from "success" to "default" with green styling
      case 'REJECTED': return "destructive";
      case 'CANCELED': return "secondary";
      case 'COMPLETED': return "default";
      default: return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Showing Request Details</DialogTitle>
          <DialogDescription>
            {isBuyer ? "Your request to view this property" : "Request to view your property"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="font-medium">{formatDate(showing.requestedDate)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{formatTime(showing.requestedTimeStart)} - {formatTime(showing.requestedTimeEnd)}</span>
              </div>
            </div>
            <Badge 
              variant={getBadgeVariant(showing.status)}
              className={showing.status === 'APPROVED' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
            >
              {showing.status.charAt(0) + showing.status.slice(1).toLowerCase()}
            </Badge>
          </div>
          
          {!isBuyer && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Buyer Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{showing.buyerName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{showing.buyerPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>{showing.buyerEmail}</span>
                  </div>
                </div>
              </div>
              
              {showing.buyerNotes && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Buyer's Notes</h4>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    <MessageSquare className="w-4 h-4 inline-block mr-2 text-muted-foreground" />
                    {showing.buyerNotes}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!isBuyer && showing.status === 'PENDING' && (
            <div className="border-t pt-4">
              <Label htmlFor="seller-notes">Add notes for the buyer (optional)</Label>
              <Textarea
                id="seller-notes"
                placeholder="Add any specific instructions or notes for the buyer..."
                value={sellerNotes}
                onChange={(e) => setSellerNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          )}
          
          {isBuyer && showing.sellerNotes && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Seller's Notes</h4>
              <div className="bg-muted p-3 rounded-md text-sm">
                <MessageSquare className="w-4 h-4 inline-block mr-2 text-muted-foreground" />
                {showing.sellerNotes}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center gap-2">
          {!isBuyer && showing.status === 'PENDING' && onStatusChange && (
            <>
              <Button 
                onClick={() => handleStatusChange('REJECTED')}
                variant="destructive"
                disabled={isLoading}
              >
                Decline
              </Button>
              <Button 
                onClick={() => handleStatusChange('APPROVED')}
                disabled={isLoading}
              >
                Approve
              </Button>
            </>
          )}
          
          {isBuyer && showing.status === 'PENDING' && onStatusChange && (
            <Button 
              onClick={() => handleStatusChange('CANCELED')}
              variant="destructive"
              disabled={isLoading}
            >
              Cancel Request
            </Button>
          )}
          
          {((isBuyer && showing.status !== 'PENDING') || 
            (!isBuyer && showing.status !== 'PENDING') ||
            !onStatusChange) && (
            <Button 
              onClick={handleClose}
              variant="outline"
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
