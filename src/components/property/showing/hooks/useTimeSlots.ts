
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, startOfDay } from "date-fns";

interface UseTimeSlotsProps {
  selectedDate: Date | undefined;
  propertyId: string;
  sellerId: string;
}

export function useTimeSlots({ selectedDate, propertyId, sellerId }: UseTimeSlotsProps) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedDate || !propertyId || !sellerId) return;
    
    const fetchAvailableTimeSlots = async () => {
      setIsLoadingSlots(true);
      
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

  return {
    availableTimeSlots,
    isLoadingSlots
  };
}
