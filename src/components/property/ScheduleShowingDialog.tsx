
import { useState } from "react";
import { toast } from "sonner";
import { Showing } from "@/types";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShowingRequestForm from "./ShowingRequestForm";

interface ScheduleShowingDialogProps {
  propertyId: string;
  propertyTitle: string;
}

export default function ScheduleShowingDialog({
  propertyId,
  propertyTitle,
}: ScheduleShowingDialogProps) {
  const [open, setOpen] = useState(false);

  const handleShowingRequest = (
    showingData: Partial<Showing> & { name: string; email: string; phone: string }
  ) => {
    // In a real app, this would submit to your backend API
    console.log("Showing Request:", showingData);
    
    // Close the dialog
    setOpen(false);
    
    // Show success message
    toast.success("Showing Request Submitted", {
      description: "The seller has been notified of your request.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule a Showing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule a Showing</DialogTitle>
          <DialogDescription>
            Request a time to visit {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        <ShowingRequestForm
          propertyId={propertyId}
          onRequestSubmit={handleShowingRequest}
        />
      </DialogContent>
    </Dialog>
  );
}
