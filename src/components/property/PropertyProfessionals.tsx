
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building2, Wrench, User } from "lucide-react";

interface PropertyProfessionalsProps {
  propertyId: string;
}

export default function PropertyProfessionals({ propertyId }: PropertyProfessionalsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Connect with Professionals</h2>
      <p className="text-muted-foreground mb-4">
        Book services from our vetted professionals to help with your transaction.
      </p>
      
      <div className="space-y-4">
        <Link to="/professionals/inspector">
          <Button variant="outline" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Home Inspectors
          </Button>
        </Link>
        
        <Link to="/professionals/structural">
          <Button variant="outline" className="w-full justify-start">
            <Building2 className="h-4 w-4 mr-2" />
            Structural Engineers
          </Button>
        </Link>
        
        <Link to="/professionals/contractor">
          <Button variant="outline" className="w-full justify-start">
            <Wrench className="h-4 w-4 mr-2" />
            General Contractors
          </Button>
        </Link>

        <Link to="/professionals">
          <Button variant="link" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            View All Professionals
          </Button>
        </Link>
      </div>
    </div>
  );
}
