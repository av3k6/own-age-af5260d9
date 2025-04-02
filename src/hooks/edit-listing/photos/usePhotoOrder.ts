
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { PropertyPhoto } from "./types";

export const usePhotoOrder = (propertyId: string | undefined) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  // Update photo order in the database
  const updatePhotoOrder = async (orderedPhotos: PropertyPhoto[]) => {
    if (!propertyId) return false;
    
    try {
      for (let i = 0; i < orderedPhotos.length; i++) {
        await supabase
          .from('property_photos')
          .update({ display_order: i })
          .eq('id', orderedPhotos[i].id);
      }
      return true;
    } catch (error) {
      console.error('Error updating photo order:', error);
      return false;
    }
  };

  // Move photo up in the order
  const movePhotoUp = async (photos: PropertyPhoto[], index: number, setPhotos: (photos: PropertyPhoto[]) => void) => {
    if (index <= 0) return;
    
    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[index - 1];
    newPhotos[index - 1] = temp;
    
    // Update display order properties
    newPhotos[index].display_order = index;
    newPhotos[index - 1].display_order = index - 1;
    
    // Update UI immediately
    setPhotos(newPhotos);
    
    // Update in database
    try {
      await updatePhotoOrder(newPhotos);
    } catch (error) {
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to update photo order",
        variant: "destructive",
      });
    }
  };

  // Move photo down in the order
  const movePhotoDown = async (photos: PropertyPhoto[], index: number, setPhotos: (photos: PropertyPhoto[]) => void) => {
    if (index >= photos.length - 1) return;
    
    const newPhotos = [...photos];
    const temp = newPhotos[index];
    newPhotos[index] = newPhotos[index + 1];
    newPhotos[index + 1] = temp;
    
    // Update display order properties
    newPhotos[index].display_order = index;
    newPhotos[index + 1].display_order = index + 1;
    
    // Update UI immediately
    setPhotos(newPhotos);
    
    // Update in database
    try {
      await updatePhotoOrder(newPhotos);
    } catch (error) {
      // Revert on error
      toast({
        title: "Error",
        description: "Failed to update photo order",
        variant: "destructive",
      });
    }
  };

  return { updatePhotoOrder, movePhotoUp, movePhotoDown };
};
