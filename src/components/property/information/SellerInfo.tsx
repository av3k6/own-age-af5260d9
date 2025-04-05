
import { Button } from "@/components/ui/button";
import { User, Phone, Mail } from "lucide-react";

interface SellerInfoProps {
  sellerDisplayName: string;
  isOwner: boolean;
  showCallButton: boolean;
  showTextButton: boolean;
}

export default function SellerInfo({ 
  sellerDisplayName, 
  isOwner,
  showCallButton,
  showTextButton
}: SellerInfoProps) {
  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex items-center mb-4">
        <User className="h-10 w-10 bg-zen-blue-100 text-zen-blue-500 p-2 rounded-full mr-3" />
        <div>
          <h3 className="font-medium">{sellerDisplayName}</h3>
          <p className="text-sm text-zen-gray-600">Property Owner</p>
        </div>
      </div>
      
      {!isOwner && (
        <div className="flex space-x-2">
          {showCallButton && (
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          )}
          
          {showTextButton && (
            <Button variant="outline" size="sm" className="flex-1">
              <Mail className="h-4 w-4 mr-2" />
              Text
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
