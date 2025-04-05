
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScheduleShowingDialog from "../showing/ScheduleShowingDialog";
import ContactSellerDialog from "../contact/ContactSellerDialog";

interface BuyerActionsProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export default function BuyerActions({ 
  propertyId, 
  propertyTitle, 
  sellerId 
}: BuyerActionsProps) {
  return (
    <div className="space-y-3">
      <div id="schedule-showing-button">
        <ScheduleShowingDialog 
          propertyId={propertyId} 
          propertyTitle={propertyTitle}
          sellerId={sellerId}
        />
      </div>
      
      <div id="contact-seller-button">
        <ContactSellerDialog
          propertyId={propertyId}
          propertyTitle={propertyTitle}
          sellerId={sellerId}
        />
      </div>
      
      <Link to={`/property/${propertyId}/make-offer`}>
        <Button variant="secondary" className="w-full">
          Make an Offer
        </Button>
      </Link>
    </div>
  );
}
