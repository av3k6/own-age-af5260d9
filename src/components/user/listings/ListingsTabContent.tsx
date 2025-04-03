
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyListing } from "@/types";
import { PropertyGrid } from "./PropertyGrid";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { ListingsErrorAlert } from "./ListingsErrorAlert";
import { DebugInfoAlert } from "./DebugInfoAlert";
import { DataSource } from "./useUserListings";

type ListingsTabContentProps = {
  isLoading: boolean;
  error: string | null;
  listings: PropertyListing[];
  dataSource: DataSource;
  debugInfo: string;
};

export const ListingsTabContent = ({
  isLoading,
  error,
  listings,
  dataSource,
  debugInfo
}: ListingsTabContentProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleCreateListing = () => {
    navigate("/sell");
  };

  return (
    <>
      <ListingsErrorAlert error={error} />
      <DebugInfoAlert dataSource={dataSource} debugInfo={debugInfo} />
      
      {isLoading ? (
        <LoadingState />
      ) : listings.length === 0 ? (
        <EmptyState onCreateListing={handleCreateListing} />
      ) : (
        <PropertyGrid listings={listings} />
      )}
    </>
  );
};
