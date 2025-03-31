import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Showing, TimeSlot, ShowingStatus } from "@/types";
import { formatDate, formatTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Loader2, Clock } from "lucide-react";
import { format, addDays, isSameDay, isBefore, startOfDay, addMinutes } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  // Ensure we don't allow scheduling in the past
  const today = new Date();
  const disabledDays = { before: today };
  
  useEffect(() => {
    if (!selectedDate || !propertyId || !sellerId) return;
    
    const fetchAvailableTimeSlots = async () => {
      setIsLoadingSlots(true);
      setSelectedTime(null);
      
      try {
        // First, get seller's availability for this day of week
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('seller_availability')
          .select('*')
          .eq('seller_id', sellerId)
          .eq('property_id', propertyId)
          .eq('day_of_week', dayOfWeek)
          .eq('is_available', true);
          
        if (availabilityError) {
          throw new Error(availabilityError.message);
        }
        
        // If no availability set for this day, use default time slots
        const defaultStartTime = "09:00";
        const defaultEndTime = "17:00";
        const slotDurationMinutes = 60; // 1 hour slots
        
        const startTimeStr = availabilityData && availabilityData.length > 0 
          ? availabilityData[0].start_time 
          : defaultStartTime;
          
        const endTimeStr = availabilityData && availabilityData.length > 0 
          ? availabilityData[0].end_time 
          : defaultEndTime;
          
        // Convert time strings to Date objects for the selected date
        const startHour = parseInt(startTimeStr.split(':')[0], 10);
        const startMinute = parseInt(startTimeStr.split(':')[1], 10);
        
        const endHour = parseInt(endTimeStr.split(':')[0], 10);
        const endMinute = parseInt(endTimeStr.split(':')[1], 10);
        
        const startTime = new Date(selectedDate);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        const endTime = new Date(selectedDate);
        endTime.setHours(endHour, endMinute, 0, 0);
        
        // Generate time slots
        const slots: TimeSlot[] = [];
        let currentSlotStart = new Date(startTime);
        
        while (currentSlotStart < endTime) {
          const slotEnd = new Date(currentSlotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + slotDurationMinutes);
          
          if (slotEnd <= endTime) {
            slots.push({
              startTime: new Date(currentSlotStart),
              endTime: new Date(slotEnd),
              isAvailable: true
            });
          }
          
          currentSlotStart = new Date(slotEnd);
        }
        
        // Get existing bookings for this date to mark slots as unavailable
        const startOfSelectedDate = startOfDay(selectedDate);
        const endOfSelectedDate = new Date(startOfSelectedDate);
        endOfSelectedDate.setDate(endOfSelectedDate.getDate() + 1);
        
        const { data: existingShowings, error: showingsError } = await supabase
          .from('showings')
          .select('*')
          .eq('property_id', propertyId)
          .eq('seller_id', sellerId)
          .gte('start_time', startOfSelectedDate.toISOString())
          .lt('start_time', endOfSelectedDate.toISOString())
          .not('status', 'in', '("declined","cancelled")');
          
        if (showingsError) {
          console.error("Error fetching existing showings:", showingsError);
          // Continue with all slots marked available if there's an error
        } else if (existingShowings && existingShowings.length > 0) {
          // Mark slots as unavailable if they overlap with existing bookings
          slots.forEach((slot, index) => {
            const isOverlapping = existingShowings.some(showing => {
              const showingStart = new Date(showing.start_time);
              const showingEnd = new Date(showing.end_time);
              
              return (
                (slot.startTime >= showingStart && slot.startTime < showingEnd) ||
                (slot.endTime > showingStart && slot.endTime <= showingEnd) ||
                (slot.startTime <= showingStart && slot.endTime >= showingEnd)
              );
            });
            
            if (isOverlapping) {
              slots[index].isAvailable = false;
            }
          });
        }
        
        // Filter out past time slots for today
        const now = new Date();
        const filteredSlots = slots.filter(slot => {
          if (isSameDay(selectedDate, now)) {
            return slot.startTime > now;
          }
          return true;
        });
        
        setAvailableTimeSlots(filteredSlots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
        setAvailableTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };
    
    fetchAvailableTimeSlots();
  }, [selectedDate, propertyId, sellerId, supabase, toast]);
  
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
