
import { format } from "date-fns";
import { Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TimeSlot } from "@/types";

interface TimeSlotSelectorProps {
  selectedDate: Date;
  selectedTime: string | null;
  availableTimeSlots: TimeSlot[];
  isLoadingSlots: boolean;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotSelector({
  selectedDate,
  selectedTime,
  availableTimeSlots,
  isLoadingSlots,
  onTimeSelect
}: TimeSlotSelectorProps) {
  return (
    <div className="flex-1 border rounded-md shadow p-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">
          {format(selectedDate, "EEEE, MMMM d")}
        </h4>
      </div>
      
      {isLoadingSlots ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : availableTimeSlots.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No available time slots</p>
        </div>
      ) : (
        <ScrollArea className="h-[220px] pr-4">
          <div className="grid grid-cols-2 gap-2">
            {availableTimeSlots.map((slot, index) => {
              const timeString = format(slot.startTime, "HH:mm");
              return (
                <Button
                  key={index}
                  variant={selectedTime === timeString ? "default" : "outline"}
                  className={cn(
                    "flex justify-center",
                    !slot.isAvailable && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={!slot.isAvailable}
                  onClick={() => onTimeSelect(timeString)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {format(slot.startTime, "h:mm a")}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
