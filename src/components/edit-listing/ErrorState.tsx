
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Alert className="mb-6 bg-red-50 dark:bg-red-950/20 border-red-300">
          <AlertTitle className="text-red-800 dark:text-red-300 text-lg font-semibold">
            Error Loading Property
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            There was an issue loading the property data. This could be due to a network issue or the property may not exist.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-4">
          <Button onClick={onRetry} className="flex items-center gap-2">
            <RefreshCcw size={16} />
            Retry
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Link to={`/dashboard`} className="text-blue-600 hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
