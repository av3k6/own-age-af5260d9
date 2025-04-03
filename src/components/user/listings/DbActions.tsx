
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { clearPropertyListings } from "@/utils/databaseCleanup";

type DbActionsProps = {
  refreshListings: (mockOnly: boolean) => void;
};

export const DbActions = ({ refreshListings }: DbActionsProps) => {
  const { toast } = useToast();
  const [isClearingDb, setIsClearingDb] = useState(false);
  
  const handleClearDatabase = async () => {
    if (!confirm("Are you sure you want to clear all property listings from the database? This cannot be undone.")) {
      return;
    }
    
    setIsClearingDb(true);
    try {
      const result = await clearPropertyListings();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh listings after clearing the database
        // This will show only mock data
        refreshListings(true);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: `Failed to clear database: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsClearingDb(false);
    }
  };

  return (
    <Button 
      variant="destructive"
      onClick={handleClearDatabase}
      disabled={isClearingDb}
    >
      {isClearingDb ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
      Clear Database
    </Button>
  );
};
