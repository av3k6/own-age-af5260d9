
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, EyeOff, Eye } from "lucide-react";
import { PropertyListing, ListingStatus } from "@/types";

interface OwnerActionsProps {
  property: PropertyListing;
  status: ListingStatus;
  isUpdating: boolean;
  onToggleStatus: () => void;
}

export default function OwnerActions({ 
  property, 
  status, 
  isUpdating, 
  onToggleStatus 
}: OwnerActionsProps) {
  return (
    <div className="space-y-3">
      <Link to={`/edit-listing/${property.id}`}>
        <Button className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Edit Listing
        </Button>
      </Link>
      
      <Button 
        variant="outline" 
        className="w-full" 
        onClick={onToggleStatus}
        disabled={isUpdating}
      >
        {isUpdating ? (
          "Updating..."
        ) : (
          <>
            {status === ListingStatus.ACTIVE ? (
              <EyeOff className="h-4 w-4 mr-2" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            {status === ListingStatus.ACTIVE ? "Set to Pending" : "Set to Active"}
          </>
        )}
      </Button>
    </div>
  );
}
