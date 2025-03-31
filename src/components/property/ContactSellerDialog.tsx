
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import ContactSellerDialog from "./contact/ContactSellerDialog";

interface ContactSellerProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

// This is now just a wrapper around the refactored component to maintain backward compatibility
export default function ContactSeller({ 
  propertyId, 
  propertyTitle,
  sellerId 
}: ContactSellerProps) {
  return (
    <ContactSellerDialog
      propertyId={propertyId}
      propertyTitle={propertyTitle}
      sellerId={sellerId}
    />
  );
}
