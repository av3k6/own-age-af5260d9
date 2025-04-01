
import { useState, useEffect } from "react";
import { format, addDays, startOfDay, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { Showing, TimeSlot } from "@/types";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch seller availability for the selected date
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!date) return;
      
      setIsLoading(true);
      
      try {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Fetch seller availability for this property and day of week
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('seller_availability')
          .select('*')
          .eq('property_id', propertyId)
          .eq('seller_id', sellerId)
          .eq('day_of_week', dayOfWeek)
          .eq('is_available', true);
        
        if (availabilityError) throw availabilityError;
        
        // Also fetch existing viewings for this date to check for conflicts
        const formattedDate = format(date, 'yyyy-MM-dd');
        const { data: viewingsData, error: viewingsError } = await supabase
          .from('property_viewings')
          .select('*')
          .eq('property_id', propertyId)
          .eq('requested_date', formattedDate)
          .in('status', ['PENDING', 'APPROVED']);
          
        if (viewingsError) throw viewingsError;
        
        // Generate time slots from availability
        const slots: TimeSlot[] = [];
        
        if (availabilityData && availabilityData.length > 0) {
          // For each availability slot, generate 30-minute viewing slots
          availabilityData.forEach(slot => {
            const [startHour, startMinute] = slot.start_time.split(':').map(Number);
            const [endHour, endMinute] = slot.end_time.split(':').map(Number);
            
            const slotDate = new Date(date);
            let currentSlotStart = new Date(slotDate);
            currentSlotStart.setHours(startHour, startMinute, 0, 0);
            
            const slotEndTime = new Date(slotDate);
            slotEndTime.setHours(endHour, endMinute, 0, 0);
            
            // Generate 30-minute slots
            while (currentSlotStart < slotEndTime) {
              const slotEnd = new Date(currentSlotStart);
              slotEnd.setMinutes(currentSlotStart.getMinutes() + 30);
              
              if (slotEnd <= slotEndTime) {
                // Check if this slot conflicts with any existing viewings
                const isAvailable = !viewingsData?.some(viewing => {
                  const viewingStart = new Date(
                    `${viewing.requested_date}T${viewing.requested_time_start}`
                  );
                  const viewingEnd = new Date(
                    `${viewing.requested_date}T${viewing.requested_time_end}`
                  );
                  
                  // Check if there's an overlap
                  return (
                    (currentSlotStart >= viewingStart && currentSlotStart < viewingEnd) ||
                    (slotEnd > viewingStart && slotEnd <= viewingEnd) ||
                    (currentSlotStart <= viewingStart && slotEnd >= viewingEnd)
                  );
                });
                
                slots.push({
                  startTime: new Date(currentSlotStart),
                  endTime: new Date(slotEnd),
                  isAvailable
                });
              }
              
              // Move to next slot
              currentSlotStart = slotEnd;
            }
          });
        }
        
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({
          title: "Error",
          description: "Failed to load available time slots",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [date, propertyId, sellerId, supabase, toast]);
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(null); // Reset selected slot when date changes
  };
  
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;
    
    setSelectedSlot(slot);
    
    // Create a showing object and pass it to the parent component
    if (date) {
      const showing: Partial<Showing> = {
        propertyId,
        sellerId,
        buyerId: user?.id || "",
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "PENDING"
      };
      
      onSchedule(showing);
    }
  };
  
  const renderTimeSlots = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    }
    
    if (!date) {
      return (
        <p className="text-center text-muted-foreground">
          Please select a date to see available time slots
        </p>
      );
    }
    
    if (availableTimeSlots.length === 0) {
      return (
        <p className="text-center text-muted-foreground">
          No available time slots for this date
        </p>
      );
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {availableTimeSlots.map((slot, index) => (
          <Button
            key={index}
            variant={selectedSlot === slot ? "default" : "outline"}
            size="sm"
            className="justify-start"
            disabled={!slot.isAvailable}
            onClick={() => handleTimeSlotSelect(slot)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {format(slot.startTime, "h:mm a")} - {format(slot.endTime, "h:mm a")}
          </Button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="mb-4">
            <h3 className="font-medium mb-1">Select a Date</h3>
            <p className="text-sm text-muted-foreground">
              Choose a date for your property viewing
            </p>
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(date) => {
              const now = new Date();
              const today = startOfDay(now);
              // Disable dates in the past and more than 30 days in the future
              return date < today || date > addDays(today, 30);
            }}
            initialFocus
            className="rounded-md border pointer-events-auto"
          />
        </div>
        
        <div className="md:w-1/2">
          <div className="mb-4">
            <h3 className="font-medium mb-1">Available Time Slots</h3>
            <p className="text-sm text-muted-foreground">
              {date ? (
                `Showing available times for ${format(date, "MMMM d, yyyy")}`
              ) : (
                "Select a date to see available time slots"
              )}
            </p>
          </div>
          
          <div className="border rounded-md p-4">
            {renderTimeSlots()}
          </div>
        </div>
      </div>
    </div>
  );
}
