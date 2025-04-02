
import { useState } from "react";
import { format } from "date-fns";
import { OpenHouseSession } from "@/types/open-house";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OpenHouseListProps {
  sessions: OpenHouseSession[];
  onEdit: (session: OpenHouseSession) => void;
  onDelete: (id: string) => void;
}

export default function OpenHouseList({ 
  sessions, 
  onEdit, 
  onDelete 
}: OpenHouseListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No open house sessions scheduled yet.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {format(session.date, "EEEE, MMMM d, yyyy")}
            </CardTitle>
            <CardDescription className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {session.startTime} - {session.endTime}
            </CardDescription>
          </CardHeader>
          {session.notes && (
            <CardContent>
              <p className="text-sm">{session.notes}</p>
            </CardContent>
          )}
          <CardFooter className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(session)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <AlertDialog
              open={selectedId === session.id}
              onOpenChange={(open) => {
                if (!open) setSelectedId(null);
              }}
            >
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setSelectedId(session.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Open House Session</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove the open house session scheduled for {format(session.date, "MMMM d, yyyy")} from {session.startTime} to {session.endTime}. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(session.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
