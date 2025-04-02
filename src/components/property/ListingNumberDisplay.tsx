
import React from "react";
import { useListingNumber } from "@/hooks/useListingNumber";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ListingNumberDisplayProps {
  listingNumber?: string;
  listingStatus?: string;
  showLabel?: boolean;
  className?: string;
}

const ListingNumberDisplay: React.FC<ListingNumberDisplayProps> = ({
  listingNumber,
  listingStatus,
  showLabel = true,
  className = "",
}) => {
  const { formatListingNumber } = useListingNumber();
  const formattedNumber = formatListingNumber(listingNumber, listingStatus);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showLabel && <span className="text-muted-foreground">Listing #:</span>}
      <span className="font-mono text-sm">{formattedNumber}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Unique identifier for this property listing</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ListingNumberDisplay;
