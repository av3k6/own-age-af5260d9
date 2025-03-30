
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShowingWithProperty } from "../types";
import { ShowingStatus } from "@/types";
import { formatDate, formatTime } from "@/lib/formatters";
import { formatAddress, getStatusBadge } from "./ShowingTable";
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Loader2, CheckCircle, XCircle } from "lucide-react";

interface ShowingDetailsDialogProps {
  showing: ShowingWithProperty | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (showingId: string, newStatus: ShowingStatus) => void;
  isBuyer: boolean;
  isProcessing: boolean;
}

export const ShowingDetailsDialog = ({
  showing,
  isOpen,
  onOpenChange,
  onUpdateStatus,
  isBuyer,
  isProcessing
}: ShowingDetailsDialogProps) => {
  if (!showing) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Showing Details</DialogTitle>
          <DialogDescription>
            {showing.property?.title || 'Property Showing Request'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-md overflow-hidden bg-muted">
              {showing.property?.images && showing.property.images.length > 0 ? (
                <img 
                  src={showing.property.images[0]} 
                  alt={showing.property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium">{showing.property?.title || 'Property'}</h3>
              <p className="text-sm text-muted-foreground">
                {showing.property?.address 
                  ? formatAddress(showing.property.address)
                  : 'Address not available'}
              </p>
              <div className="mt-2">
                {getStatusBadge(showing.status)}
              </div>
            </div>
          </div>
          
          <div className="rounded-md border p-4 bg-muted/10 space-y-2">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium">{formatDate(showing.startTime)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {formatTime(showing.startTime)} - {formatTime(showing.endTime)}
              </span>
            </div>
          </div>
          
          {isBuyer ? (
            <div className="rounded-md border p-4 space-y-2">
              <h4 className="text-sm font-medium">Seller Information</h4>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{showing.sellerName || 'Seller'}</span>
              </div>
              {showing.status === ShowingStatus.APPROVED && (
                <>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:seller@example.com`} className="text-primary">
                      Contact Seller
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Contact information is available after your request is approved.
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border p-4 space-y-2">
              <h4 className="text-sm font-medium">Buyer Information</h4>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{showing.buyerName || 'Buyer'}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`mailto:${showing.buyerEmail}`} className="text-primary">
                  {showing.buyerEmail}
                </a>
              </div>
              
              {showing.buyerPhone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${showing.buyerPhone}`} className="text-primary">
                    {showing.buyerPhone}
                  </a>
                </div>
              )}
            </div>
          )}
          
          {showing.notes && (
            <div className="rounded-md border p-4">
              <div className="flex items-start space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm mt-1">{showing.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!isBuyer && showing.status === ShowingStatus.REQUESTED && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => onUpdateStatus(showing.id, ShowingStatus.APPROVED)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
              <Button 
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => onUpdateStatus(showing.id, ShowingStatus.DECLINED)}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Decline
              </Button>
            </div>
          )}
          
          {showing.status === ShowingStatus.APPROVED && (
            <Button 
              variant="destructive"
              onClick={() => onUpdateStatus(showing.id, ShowingStatus.CANCELLED)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              Cancel Showing
            </Button>
          )}
          
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
