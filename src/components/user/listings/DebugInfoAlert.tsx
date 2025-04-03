
import { Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { DataSource } from "./useUserListings";

type DebugInfoAlertProps = {
  dataSource: DataSource;
  debugInfo: string;
};

export const DebugInfoAlert = ({ dataSource, debugInfo }: DebugInfoAlertProps) => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Data Source: {dataSource === 'both' ? 'Supabase & Mock Data' : dataSource === 'supabase' ? 'Supabase' : 'Mock Data'}</AlertTitle>
      <AlertDescription className="whitespace-pre-line text-xs font-mono">
        {debugInfo}
      </AlertDescription>
    </Alert>
  );
};
