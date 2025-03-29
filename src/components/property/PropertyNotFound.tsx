
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Alert className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
        <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-semibold">
          Property not found
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          The property you're looking for doesn't exist, has been removed, or you don't have permission to view it.
        </AlertDescription>
      </Alert>
      
      <div className="mt-8 flex flex-col items-center">
        <p className="text-zen-gray-600 mb-6 text-center max-w-md">
          The property listing may have been deleted by the owner or is temporarily unavailable.
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
