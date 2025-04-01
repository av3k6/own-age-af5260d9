
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="border rounded-lg p-6 bg-destructive/10 text-center">
      <AlertCircle className="h-10 w-10 mx-auto mb-2 text-destructive" />
      <h3 className="font-semibold mb-2">{message}</h3>
      <Button onClick={onRetry} variant="outline" className="mt-2">
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
