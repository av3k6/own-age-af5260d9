import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Info, User } from "lucide-react";

interface PropertyProfessionalsProps {
  propertyId: string;
}

export default function PropertyProfessionals({ propertyId }: PropertyProfessionalsProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Connect with Professionals</h2>
      <p className="text-zen-gray-600 mb-4">
        Book services from our vetted professionals to help with your transaction.
      </p>
      
      <div className="space-y-4">
        <Link to="/professionals/inspectors">
          <Button variant="outline" className="w-full justify-start">
            <Info className="h-4 w-4 mr-2" />
            Home Inspectors
          </Button>
        </Link>
        
        <Link to="/professionals/contractors">
          <Button variant="outline" className="w-full justify-start">
            <Home className="h-4 w-4 mr-2" />
            Contractors
          </Button>
        </Link>
        
        <Link to="/professionals/lawyers">
          <Button variant="outline" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Real Estate Lawyers
          </Button>
        </Link>
      </div>
    </div>
  );
}
