
import { useState } from "react";
import { formatDate, formatTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Home, User, Calendar as CalendarIcon } from "lucide-react";
import { ViewingRequest } from "@/types/showing";
import ShowingDetailsDialog from "./ShowingDetailsDialog";

interface ShowingTableProps {
  showings: ViewingRequest[];
  isBuyer: boolean;
  onStatusChange?: (id: string, status: string) => Promise<void>;
}

export default function ShowingTable({ 
  showings, 
  isBuyer,
  onStatusChange 
}: ShowingTableProps) {
  const [selectedShowing, setSelectedShowing] = useState<ViewingRequest | null>(null);
  
  if (showings.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">
          {isBuyer 
            ? "You have no showing requests. Browse properties to schedule viewings!" 
            : "You have no showing requests from buyers yet."}
        </p>
        {isBuyer && (
          <Button variant="outline" className="mt-4" asChild>
            <a href="/buy">
              <Home className="mr-2 h-4 w-4" />
              Browse Properties
            </a>
          </Button>
        )}
      </div>
    );
  }
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return "outline";
      case 'APPROVED': return "default"; // Changed from "success" to "default"
      case 'REJECTED': return "destructive";
      case 'CANCELED': return "secondary";
      case 'COMPLETED': return "default";
      default: return "outline";
    }
  };
  
  const getFormattedStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };
  
  const openShowingDetails = (showing: ViewingRequest) => {
    setSelectedShowing(showing);
  };
  
  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>{isBuyer ? "Seller" : "Buyer"}</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showings.map((showing) => (
              <TableRow key={showing.id}>
                <TableCell className="font-medium">
                  Property #{showing.propertyId.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-1 h-3 w-3" />
                      {formatDate(showing.requestedDate)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTime(showing.requestedTimeStart)} - {formatTime(showing.requestedTimeEnd)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="mr-1 h-4 w-4" />
                    {isBuyer 
                      ? `Seller #${showing.sellerId.slice(0, 8)}` 
                      : showing.buyerName || `Buyer #${showing.buyerId.slice(0, 8)}`}
                  </div>
                  {!isBuyer && showing.buyerPhone && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {showing.buyerPhone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getBadgeVariant(showing.status)}
                    className={showing.status === 'APPROVED' ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                  >
                    {getFormattedStatus(showing.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openShowingDetails(showing)}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View showing details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedShowing && (
        <ShowingDetailsDialog
          showing={selectedShowing}
          isBuyer={isBuyer}
          onClose={() => setSelectedShowing(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
