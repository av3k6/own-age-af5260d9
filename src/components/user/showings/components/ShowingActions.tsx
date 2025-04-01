
import { Button } from "@/components/ui/button";
import { ShowingWithProperty } from "../types";
import { ShowingStatus } from "@/types/enums";
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  ExternalLink 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShowingActionsProps {
  showing: ShowingWithProperty;
  isBuyer: boolean;
  onView: (showing: ShowingWithProperty) => void;
  onUpdateStatus: (showingId: string, newStatus: ShowingStatus) => void;
  isProcessing: boolean;
}

export const ShowingActions = ({ 
  showing, 
  isBuyer, 
  onView, 
  onUpdateStatus,
  isProcessing 
}: ShowingActionsProps) => {
  // Check for processing state
  if (isProcessing) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }
  
  // Handle each status explicitly to avoid TypeScript errors
  switch (showing.status) {
    // Seller actions for requested showings
    case ShowingStatus.PENDING:
      if (!isBuyer) {
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-green-500 text-green-600 hover:bg-green-50"
              onClick={() => onUpdateStatus(showing.id, ShowingStatus.APPROVED)}
            >
              <CheckCircle className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => onUpdateStatus(showing.id, ShowingStatus.REJECTED)}
            >
              <XCircle className="h-4 w-4 mr-1" /> Decline
            </Button>
          </div>
        );
      }
      break;
      
    // Actions for approved showings
    case ShowingStatus.APPROVED:
      // Check if it's a past showing (for sellers to mark as completed)
      if (new Date(showing.startTime) < new Date()) {
        if (!isBuyer) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => onUpdateStatus(showing.id, ShowingStatus.COMPLETED)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> 
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onView(showing)}>
                  <ExternalLink className="h-4 w-4 mr-2" /> 
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }
        
        return (
          <Button variant="ghost" size="icon" onClick={() => onView(showing)}>
            <ExternalLink className="h-5 w-5" />
          </Button>
        );
      }
      
      // Regular approved showings (not past)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => onUpdateStatus(showing.id, ShowingStatus.CANCELED)}
              className="text-red-600"
            >
              <XCircle className="h-4 w-4 mr-2" /> 
              Cancel Showing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(showing)}>
              <ExternalLink className="h-4 w-4 mr-2" /> 
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      
    // Handle completed showings
    case ShowingStatus.COMPLETED:
      return (
        <Button variant="ghost" size="icon" onClick={() => onView(showing)}>
          <ExternalLink className="h-5 w-5" />
        </Button>
      );
      
    // For cancelled or declined showings
    case ShowingStatus.CANCELED:
    case ShowingStatus.REJECTED:
      return (
        <Button variant="ghost" size="icon" onClick={() => onView(showing)}>
          <ExternalLink className="h-5 w-5" />
        </Button>
      );
  }
  
  // Default fallback for any other status
  return (
    <Button variant="ghost" size="icon" onClick={() => onView(showing)}>
      <ExternalLink className="h-5 w-5" />
    </Button>
  );
};
