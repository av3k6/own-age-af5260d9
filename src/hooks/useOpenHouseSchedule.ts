
import { useState, useCallback } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { OpenHouseSession, OpenHouseSessionFormValues } from "@/types/open-house";
import { 
  fetchOpenHouseSessions, 
  addOpenHouseSession, 
  updateOpenHouseSession, 
  deleteOpenHouseSession 
} from "@/services/openHouse/openHouseService";
import { filterFutureOpenHouses } from "@/utils/openHouse/openHouseUtils";

export const useOpenHouseSchedule = (propertyId?: string) => {
  const [sessions, setSessions] = useState<OpenHouseSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const fetchSessions = useCallback(async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await fetchOpenHouseSessions(supabase, propertyId);

      if (error) {
        throw error;
      }
      
      if (data) {
        // Filter to show only future open houses
        const futureOpenHouses = filterFutureOpenHouses(data as OpenHouseSession[]);
        setSessions(futureOpenHouses);
      }
    } catch (error: any) {
      console.error("Error fetching open house sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load open house sessions: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, supabase, toast]);

  const addSession = async (session: OpenHouseSessionFormValues) => {
    if (!propertyId) return null;
    
    setIsSaving(true);
    try {
      const { data, error } = await addOpenHouseSession(supabase, propertyId, session);

      if (error) {
        throw error;
      }
      
      if (data) {
        setSessions([...sessions, data as OpenHouseSession]);
        
        toast({
          title: "Success",
          description: "Open house session added",
        });
        
        return data;
      }
      return null;
    } catch (error: any) {
      console.error("Error adding open house session:", error);
      toast({
        title: "Error",
        description: "Failed to add open house session: " + error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const updateSession = async (id: string, session: OpenHouseSessionFormValues) => {
    if (!propertyId) return;
    
    setIsSaving(true);
    try {
      const { data, error } = await updateOpenHouseSession(supabase, id, session);

      if (error) {
        throw error;
      }
      
      if (data) {
        setSessions(sessions.map(s => s.id === id ? data as OpenHouseSession : s));
        
        toast({
          title: "Success",
          description: "Open house session updated",
        });
        
        return data;
      }
      return null;
    } catch (error: any) {
      console.error("Error updating open house session:", error);
      toast({
        title: "Error",
        description: "Failed to update open house session",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSession = async (id: string) => {
    if (!propertyId) return;
    
    setIsSaving(true);
    try {
      const { success, error } = await deleteOpenHouseSession(supabase, id);

      if (error) {
        throw error;
      }
      
      if (success) {
        setSessions(sessions.filter(s => s.id !== id));
        
        toast({
          title: "Success",
          description: "Open house session removed",
        });
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error deleting open house session:", error);
      toast({
        title: "Error",
        description: "Failed to delete open house session",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    sessions,
    isLoading,
    isSaving,
    fetchSessions,
    addSession,
    updateSession,
    deleteSession
  };
};
