
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { OpenHouseSession } from "@/types/open-house";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OpenHouseScheduleProps {
  propertyId: string;
}

export default function OpenHouseSchedule({ propertyId }: OpenHouseScheduleProps) {
  const [sessions, setSessions] = useState<OpenHouseSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOpenHouseSessions() {
      if (!propertyId) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("property_open_houses")
          .select("*")
          .eq("property_id", propertyId)
          .order("date", { ascending: true });
        
        if (error) {
          throw error;
        }
        
        // Only show future open houses
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to beginning of today
        
        const formattedSessions = data
          .map(session => ({
            id: session.id,
            propertyId: session.property_id,
            date: new Date(session.date),
            startTime: session.start_time,
            endTime: session.end_time,
            notes: session.notes,
            createdAt: new Date(session.created_at),
            updatedAt: new Date(session.updated_at)
          }))
          .filter(session => session.date >= now);
          
        setSessions(formattedSessions);
      } catch (error: any) {
        console.error("Error fetching open house sessions:", error);
        toast({
          title: "Error",
          description: "Failed to load open house schedule",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOpenHouseSessions();
  }, [propertyId, supabase, toast]);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  
  if (sessions.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Open House Schedule</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className="border border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-zen-blue-500" />
                {format(session.date, "EEEE, MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>
                  {session.startTime} - {session.endTime}
                </span>
              </div>
              {session.notes && (
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
