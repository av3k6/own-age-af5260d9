
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Home, Search, AlertCircle, Lock } from "lucide-react";

type PropertyNotFoundProps = {
  errorType?: 'not-found' | 'invalid-id' | 'no-permission' | null;
  propertyId?: string;
};

export default function PropertyNotFound({ errorType = 'not-found', propertyId }: PropertyNotFoundProps) {
  // Determine error message based on error type
  const getErrorContent = () => {
    switch (errorType) {
      case 'invalid-id':
        return {
          title: "Invalid Property ID",
          description: "The property ID format is invalid. Please check the URL and try again.",
          alertVariant: "bg-amber-50 dark:bg-amber-950/20 border-amber-300",
          titleClass: "text-amber-800 dark:text-amber-300",
          descClass: "text-amber-700 dark:text-amber-400",
          icon: <AlertCircle className="h-4 w-4" />,
          message: `The property ID "${propertyId}" has an invalid format. Property IDs should be in UUID format.`
        };
      case 'no-permission':
        return {
          title: "Access Restricted",
          description: "You don't have permission to view this property listing.",
          alertVariant: "bg-blue-50 dark:bg-blue-950/20 border-blue-300",
          titleClass: "text-blue-800 dark:text-blue-300",
          descClass: "text-blue-700 dark:text-blue-400",
          icon: <Lock className="h-4 w-4" />,
          message: "This property may be in pending status and only visible to the property owner."
        };
      case 'not-found':
      default:
        return {
          title: "Property not found",
          description: "The property you're looking for doesn't exist, has been removed, or is no longer available.",
          alertVariant: "bg-amber-50 dark:bg-amber-950/20 border-amber-300",
          titleClass: "text-amber-800 dark:text-amber-300",
          descClass: "text-amber-700 dark:text-amber-400",
          icon: <AlertCircle className="h-4 w-4" />,
          message: "The property listing may have been deleted by the owner or is temporarily unavailable."
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="container mx-auto px-4 py-12">
      <Alert className={`mb-6 ${errorContent.alertVariant}`}>
        <div className="flex items-center gap-2">
          {errorContent.icon}
          <AlertTitle className={`${errorContent.titleClass} text-lg font-semibold`}>
            {errorContent.title}
          </AlertTitle>
        </div>
        <AlertDescription className={errorContent.descClass}>
          {errorContent.description}
        </AlertDescription>
      </Alert>
      
      <div className="mt-8 flex flex-col items-center">
        <p className="text-zen-gray-600 mb-6 text-center max-w-md">
          {errorContent.message}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link to="/buy" className="w-full sm:w-auto">
            <Button className="w-full flex items-center gap-2">
              <Search size={16} />
              Browse Properties
            </Button>
          </Link>
          
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              variant="ghost" 
              className="w-full flex items-center gap-2"
            >
              <Home size={16} />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
