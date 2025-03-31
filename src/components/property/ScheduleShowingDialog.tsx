
import ScheduleShowingDialog from "./showing/ScheduleShowingDialog";

interface ScheduleShowingProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

// This is now just a wrapper around the refactored component to maintain backward compatibility
export default function ScheduleShowing({ 
  propertyId, 
  propertyTitle,
  sellerId 
}: ScheduleShowingProps) {
  return (
    <ScheduleShowingDialog
      propertyId={propertyId}
      propertyTitle={propertyTitle}
      sellerId={sellerId}
    />
  );
}
