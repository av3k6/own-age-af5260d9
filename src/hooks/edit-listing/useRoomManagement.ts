
import { useState, useEffect } from "react";
import { Room } from "@/types";
import { UseFormWatch } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";

export function useRoomManagement(bedroomCount: number, watch: UseFormWatch<EditListingFormValues>) {
  const [bedroomRooms, setBedroomRooms] = useState<Room[]>([]);
  const [otherRooms, setOtherRooms] = useState<Room[]>([]);

  // Sync bedroom count with form
  useEffect(() => {
    if (bedroomCount < bedroomRooms.length) {
      setBedroomRooms(prev => prev.slice(0, bedroomCount));
    }
  }, [bedroomCount, bedroomRooms.length]);

  return {
    bedroomRooms,
    setBedroomRooms,
    otherRooms,
    setOtherRooms
  };
}
