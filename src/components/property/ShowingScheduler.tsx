
import ShowingScheduler from "./showing/ShowingScheduler";

interface ShowingSchedulerProps {
  propertyId: string;
  sellerId: string;
  onSchedule: (showing: Partial<Showing>) => void;
}

// This is now just a wrapper around the refactored component to maintain backward compatibility
export default function ShowingSchedulerWrapper({ 
  propertyId, 
  sellerId,
  onSchedule 
}: ShowingSchedulerProps) {
  return (
    <ShowingScheduler
      propertyId={propertyId}
      sellerId={sellerId}
      onSchedule={onSchedule}
    />
  );
}
