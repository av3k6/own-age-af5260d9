
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContactForm from "./ContactForm";
import { useContactSeller } from "./useContactSeller";

interface ContactSellerDialogProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export default function ContactSellerDialog({ 
  propertyId, 
  propertyTitle,
  sellerId 
}: ContactSellerDialogProps) {
  const {
    isSubmitting,
    open,
    setOpen,
    userData,
    handleSubmit
  } = useContactSeller({ propertyId, propertyTitle, sellerId });
  
  // Prepare default message
  const defaultMessage = `Hi, I'm interested in ${propertyTitle}. I would like more information.`;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Mail className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller about {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        <ContactForm
          defaultMessage={defaultMessage}
          onSubmit={handleSubmit}
          userData={userData}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
