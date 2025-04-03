
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Home, Search } from "lucide-react";
import { createLogger } from "@/utils/logger";

const logger = createLogger("NotFound");

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logger.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-12">
      <Alert className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
        <AlertTitle className="text-amber-800 dark:text-amber-300 text-lg font-semibold">
          Page not found
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          The page you're looking for doesn't exist or has been moved.
        </AlertDescription>
      </Alert>
      
      <div className="mt-8 flex flex-col items-center">
        <p className="text-zen-gray-600 mb-6 text-center max-w-md">
          The URL <code className="bg-gray-100 px-1 py-0.5 rounded">{location.pathname}</code> could not be found on this server.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link to="/" className="w-full sm:w-auto">
            <Button 
              className="w-full flex items-center gap-2"
            >
              <Home size={16} />
              Go to Homepage
            </Button>
          </Link>
          
          <Link to="/buy" className="w-full sm:w-auto">
            <Button 
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Search size={16} />
              Browse Properties
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
