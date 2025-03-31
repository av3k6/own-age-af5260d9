
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Showing, ShowingStatus } from "@/types";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";
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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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
        <DateSelector 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          disabledDays={disabledDays}
        />
        
        {selectedDate && (
          <TimeSlotSelector
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            availableTimeSlots={availableTimeSlots}
            isLoadingSlots={isLoadingSlots}
            onTimeSelect={handleTimeSelect}
          />
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
