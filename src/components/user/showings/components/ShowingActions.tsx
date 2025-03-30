
import { Button } from "@/components/ui/button";
import { ShowingWithProperty } from "../types";
import { ShowingStatus } from "@/types";
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
  if (isProcessing) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }
  
  if (!isBuyer && showing.status === ShowingStatus.REQUESTED) {
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
          onClick={() => onUpdateStatus(showing.id, ShowingStatus.DECLINED)}
        >
          <XCircle className="h-4 w-4 mr-1" /> Decline
        </Button>
      </div>
    );
  }
  
  if (showing.status === ShowingStatus.APPROVED) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem 
            onClick={() => onUpdateStatus(showing.id, ShowingStatus.CANCELLED)}
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
  }
  
  // Fixed comparison issues by using === instead of logical OR with ==
  if (showing.status === ShowingStatus.COMPLETED || 
      (showing.status === ShowingStatus.APPROVED && new Date(showing.startTime) < new Date())) {
    
    if (showing.status === ShowingStatus.APPROVED && !isBuyer) {
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
  
  return (
    <Button variant="ghost" size="icon" onClick={() => onView(showing)}>
      <ExternalLink className="h-5 w-5" />
    </Button>
  );
};
