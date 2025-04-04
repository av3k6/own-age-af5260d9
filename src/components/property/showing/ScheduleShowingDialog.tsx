
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ShowingForm } from "./ShowingForm";
import { useScheduleShowing } from "./useScheduleShowing";

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
  const {
    isSubmitting,
    open,
    setOpen,
    userData,
    handleSubmit
  } = useScheduleShowing({ propertyId, propertyTitle, sellerId });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule a Showing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Showing</DialogTitle>
          <DialogDescription>
            Request to view {propertyTitle} at your preferred date and time.
          </DialogDescription>
        </DialogHeader>
        
        <ShowingForm
          onSubmit={handleSubmit}
          userData={userData}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
