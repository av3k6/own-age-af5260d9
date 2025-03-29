
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Showing } from "@/types";
import { formatDate, formatTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ShowingSchedulerProps {
  propertyId: string;
  onSchedule: (showing: Partial<Showing>) => void;
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

export default function ShowingScheduler({ propertyId, onSchedule }: ShowingSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Ensure we don't allow scheduling in the past
  const disabledDays = { before: new Date() };
  
  // Filter out weekends if needed
  // const disabledDays = { before: new Date(), dayOfWeek: [0, 6] };
  
  const handleScheduleShowing = () => {
    if (!selectedDate || !selectedTime) return;
    
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startTime = new Date(selectedDate);
    startTime.setHours(hours, minutes);
    
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    
    onSchedule({
      propertyId,
      startTime,
      endTime,
      status: "requested"
    });
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-center mb-2">
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
            onSelect={setSelectedDate}
            disabled={disabledDays}
            className={cn("rounded-md border shadow p-3 pointer-events-auto")}
          />
        </div>
        
        {selectedDate && (
          <div className="flex-1 border rounded-md shadow p-3">
            <h4 className="font-medium mb-2">Available Times for {formatDate(selectedDate)}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className="flex justify-center"
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
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
