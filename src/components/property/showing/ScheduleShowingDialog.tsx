
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import ShowingRequestForm from "./ShowingRequestForm";
import { useToast } from "@/hooks/use-toast";

interface ScheduleShowingDialogProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export default function ScheduleShowingDialog({ 
  propertyId, 
  propertyTitle,
  sellerId 
}: ScheduleShowingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleShowingRequestSubmit = (data: any) => {
    console.log("Showing request submitted:", data);
    
    toast({
      title: "Viewing Request Submitted",
      description: "The seller will be notified of your request.",
    });
    
    // Close the dialog
    setIsOpen(false);
    
    // Optional: Redirect to the user's showings page
    setTimeout(() => {
      navigate("/user/showings");
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <CalendarDays className="h-4 w-4 mr-2" />
          Schedule a Showing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule a Property Showing</DialogTitle>
          <DialogDescription>
            Request a time to view {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ShowingRequestForm
            propertyId={propertyId}
            sellerId={sellerId}
            onRequestSubmit={handleShowingRequestSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
