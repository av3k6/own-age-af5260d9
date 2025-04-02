import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { OpenHouseSession, OpenHouseSessionFormValues } from "@/types/open-house";
import { format } from "date-fns";

export const useOpenHouseSchedule = (propertyId?: string) => {
  const [sessions, setSessions] = useState<OpenHouseSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!propertyId) return;
    
    setIsLoading(true);
    try {
      console.log("Fetching open house sessions for property:", propertyId);
      const { data, error } = await supabase
        .from("property_open_houses")
        .select("*")
        .eq("property_id", propertyId)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error response from Supabase:", error);
        throw error;
      }
      
      console.log("Fetched sessions:", data);
      
      // Convert the response to our internal type
      setSessions(data.map(session => ({
        id: session.id,
        propertyId: session.property_id,
        date: new Date(session.date),
        startTime: session.start_time,
        endTime: session.end_time,
        notes: session.notes,
        createdAt: new Date(session.created_at),
        updatedAt: new Date(session.updated_at)
      })));
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
  };

  const addSession = async (session: OpenHouseSessionFormValues) => {
    if (!propertyId) return null;
    
    setIsSaving(true);
    try {
      const sessionData = {
        property_id: propertyId,
        date: format(session.date, "yyyy-MM-dd"),
        start_time: session.startTime,
        end_time: session.endTime,
        notes: session.notes || null,
      };

      console.log("Adding open house session:", sessionData);
      
      const { data, error } = await supabase
        .from("property_open_houses")
        .insert(sessionData)
        .select();

      if (error) {
        console.error("Error response from Supabase:", error);
        throw error;
      }
      
      console.log("Added session response:", data);
      
      if (!data || data.length === 0) {
        throw new Error("No data returned after insert");
      }
      
      // Convert the response to our internal type
      const newSession: OpenHouseSession = {
        id: data[0].id,
        propertyId: data[0].property_id,
        date: new Date(data[0].date),
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        notes: data[0].notes,
        createdAt: new Date(data[0].created_at),
        updatedAt: new Date(data[0].updated_at),
      };
      
      setSessions([...sessions, newSession]);
      
      toast({
        title: "Success",
        description: "Open house session added",
      });
      
      return newSession;
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
      const { data, error } = await supabase
        .from("property_open_houses")
        .update({
          date: format(session.date, "yyyy-MM-dd"),
          start_time: session.startTime,
          end_time: session.endTime,
          notes: session.notes,
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      
      // Convert the response to our internal type
      const updatedSession: OpenHouseSession = {
        id: data[0].id,
        propertyId: data[0].property_id,
        date: new Date(data[0].date),
        startTime: data[0].start_time,
        endTime: data[0].end_time,
        notes: data[0].notes,
        createdAt: new Date(data[0].created_at),
        updatedAt: new Date(data[0].updated_at),
      };
      
      setSessions(sessions.map(s => s.id === id ? updatedSession : s));
      
      toast({
        title: "Success",
        description: "Open house session updated",
      });
      
      return updatedSession;
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
      const { error } = await supabase
        .from("property_open_houses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setSessions(sessions.filter(s => s.id !== id));
      
      toast({
        title: "Success",
        description: "Open house session removed",
      });
      
      return true;
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
