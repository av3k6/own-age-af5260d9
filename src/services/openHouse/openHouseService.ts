
import { format } from "date-fns";
import { SupabaseClient } from "@supabase/supabase-js";
import { OpenHouseSession, OpenHouseSessionFormValues } from "@/types/open-house";

export interface OpenHouseServiceResponse {
  data: OpenHouseSession[] | OpenHouseSession | null;
  error: Error | null;
}

export const fetchOpenHouseSessions = async (
  supabase: SupabaseClient,
  propertyId: string
): Promise<OpenHouseServiceResponse> => {
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
    const formattedSessions = data.map(session => ({
      id: session.id,
      propertyId: session.property_id,
      date: new Date(session.date),
      startTime: session.start_time,
      endTime: session.end_time,
      notes: session.notes,
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at)
    }));
    
    return { data: formattedSessions, error: null };
  } catch (error: any) {
    console.error("Error fetching open house sessions:", error);
    return { data: null, error };
  }
};

export const addOpenHouseSession = async (
  supabase: SupabaseClient,
  propertyId: string,
  session: OpenHouseSessionFormValues
): Promise<OpenHouseServiceResponse> => {
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
    
    return { data: newSession, error: null };
  } catch (error: any) {
    console.error("Error adding open house session:", error);
    return { data: null, error };
  }
};

export const updateOpenHouseSession = async (
  supabase: SupabaseClient,
  id: string,
  session: OpenHouseSessionFormValues
): Promise<OpenHouseServiceResponse> => {
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
    
    return { data: updatedSession, error: null };
  } catch (error: any) {
    console.error("Error updating open house session:", error);
    return { data: null, error };
  }
};

export const deleteOpenHouseSession = async (
  supabase: SupabaseClient,
  id: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase
      .from("property_open_houses")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting open house session:", error);
    return { success: false, error };
  }
};
