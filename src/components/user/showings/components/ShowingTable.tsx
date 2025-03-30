
import { useState } from "react";
import { formatDate, formatTime } from "@/lib/formatters";
import { ShowingWithProperty } from "../types";
import { ShowingStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ShowingActions } from "./ShowingActions";

interface ShowingTableProps {
  showingsList: ShowingWithProperty[];
  isLoading: boolean;
  isBuyer: boolean;
  onViewShowing: (showing: ShowingWithProperty) => void;
  onUpdateStatus: (showingId: string, newStatus: ShowingStatus) => void;
  isProcessing: boolean;
}

export const getStatusBadge = (status: ShowingStatus) => {
  switch (status) {
    case ShowingStatus.REQUESTED:
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Requested</Badge>;
    case ShowingStatus.APPROVED:
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
    case ShowingStatus.DECLINED:
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Declined</Badge>;
    case ShowingStatus.COMPLETED:
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
    case ShowingStatus.CANCELLED:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const formatAddress = (address: any) => {
  if (!address) return "Address not available";
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

export const ShowingTable = ({
  showingsList,
  isLoading,
  isBuyer,
  onViewShowing,
  onUpdateStatus,
  isProcessing
}: ShowingTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (showingsList.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mt-2">No showings found</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date & Time</TableHead>
          <TableHead>Property</TableHead>
          <TableHead>{isBuyer ? 'Seller' : 'Buyer'}</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {showingsList.map((showing) => (
          <TableRow key={showing.id}>
            <TableCell>
              <div className="font-medium">{formatDate(showing.startTime)}</div>
              <div className="text-sm text-muted-foreground">
                {formatTime(showing.startTime)} - {formatTime(showing.endTime)}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{showing.property?.title || 'Property'}</div>
              <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                {showing.property?.address ? formatAddress(showing.property.address) : 'Address not available'}
              </div>
            </TableCell>
            <TableCell>
              {isBuyer ? showing.sellerName || 'Seller' : showing.buyerName || 'Buyer'}
            </TableCell>
            <TableCell>{getStatusBadge(showing.status)}</TableCell>
            <TableCell className="text-right">
              <ShowingActions 
                showing={showing} 
                isBuyer={isBuyer} 
                onView={onViewShowing} 
                onUpdateStatus={onUpdateStatus}
                isProcessing={isProcessing}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
