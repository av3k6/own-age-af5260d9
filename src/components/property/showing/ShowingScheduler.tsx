
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Showing, ShowingStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Loader2, Clock } from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTimeSlots } from "./hooks/useTimeSlots";

interface ShowingSchedulerProps {
  propertyId: string;
  sellerId: string;
  onSchedule: (showing: Partial<Showing>) => void;
}

export default function ShowingScheduler({ 
  propertyId, 
  sellerId,
  onSchedule 
}: ShowingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const { availableTimeSlots, isLoadingSlots } = useTimeSlots({
    selectedDate,
    propertyId,
    sellerId
  });
  
  // Ensure we don't allow scheduling in the past
  const today = new Date();
  const disabledDays = { before: today };
  
  const handleScheduleShowing = () => {
    if (!selectedDate || !selectedTime) return;
    
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    onSchedule({
      propertyId,
      sellerId,
      startTime,
      endTime,
      status: ShowingStatus.REQUESTED
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };
  
  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium">Select a Date & Time</h3>
        <p className="text-sm text-muted-foreground">
          Choose when you'd like to view this property
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={disabledDays}
            className={cn("rounded-md border shadow p-3")}
            initialFocus
          />
        </div>
        
        {selectedDate && (
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
                        onClick={() => setSelectedTime(timeString)}
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
        )}
      </div>
      
      <Button 
        className="mt-4"
        disabled={!selectedDate || !selectedTime}
        onClick={handleScheduleShowing}
      >
        Schedule Showing
      </Button>
    </div>
  );
}
