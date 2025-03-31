
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
import { useScheduleShowing } from "./useScheduleShowing";
import ShowingForm from "./ShowingForm";

interface ScheduleShowingDialogProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export default function ScheduleShowingDialog({
  propertyId,
  propertyTitle,
  sellerId,
}: ScheduleShowingDialogProps) {
  const {
    open,
    setOpen,
    isSubmitting,
    handleShowingRequest
  } = useScheduleShowing({
    propertyId,
    propertyTitle,
    sellerId
  });

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
        <ShowingForm
          propertyId={propertyId}
          sellerId={sellerId}
          isSubmitting={isSubmitting}
          onRequestSubmit={handleShowingRequest}
        />
      </DialogContent>
    </Dialog>
  );
}
