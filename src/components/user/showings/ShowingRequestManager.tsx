
import { useShowingRequests } from "./hooks/useShowingRequests";
import ShowingTable from "./components/ShowingTable";
import { Skeleton } from "@/components/ui/skeleton";

interface ShowingRequestManagerProps {
  isBuyer: boolean;
}

export default function ShowingRequestManager({ isBuyer }: ShowingRequestManagerProps) {
  const { showings, isLoading, changeShowingStatus } = useShowingRequests(isBuyer);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  
  // Create a wrapper function to handle the status change
  const handleStatusChange = async (id: string, status: string) => {
    await changeShowingStatus(id, status);
  };
  
  return (
    <ShowingTable 
      showings={showings} 
      isBuyer={isBuyer} 
      onStatusChange={handleStatusChange}
    />
  );
}
