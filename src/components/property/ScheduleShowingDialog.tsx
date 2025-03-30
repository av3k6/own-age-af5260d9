
import { useState } from "react";
import { toast } from "sonner";
import { Showing, ShowingStatus } from "@/types";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShowingRequestForm from "./ShowingRequestForm";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ScheduleShowingDialogProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export default function ScheduleShowingDialog({
  propertyId,
  propertyTitle,
  sellerId,
}: ScheduleShowingDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleShowingRequest = async (
    showingData: Partial<Showing> & { name: string; email: string; phone: string; agreeToNotifications: boolean }
  ) => {
    if (!user) {
      setOpen(false);
      toast.error("Please sign in to request a showing", {
        description: "You need to be logged in to schedule a showing.",
        action: {
          label: "Sign in",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the showing request in the database
      const newShowing = {
        property_id: propertyId,
        buyer_id: user.id,
        buyer_name: showingData.name,
        buyer_email: showingData.email,
        buyer_phone: showingData.phone,
        seller_id: sellerId,
        start_time: showingData.startTime,
        end_time: showingData.endTime,
        status: ShowingStatus.REQUESTED,
        notes: showingData.notes || '',
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      const { data, error } = await supabase
        .from('showings')
        .insert([newShowing])
        .select();
        
      if (error) {
        throw new Error(`Failed to create showing: ${error.message}`);
      }

      // Store notification preferences if opted in
      if (showingData.agreeToNotifications) {
        // Check if notification preferences already exist
        const { data: existingPrefs } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (!existingPrefs) {
          // Create default notification preferences
          await supabase
            .from('notification_preferences')
            .insert([{
              user_id: user.id,
              showing_requests: true,
              showing_updates: true,
              offer_updates: true,
              message_alerts: true,
              email_notifications: true,
              push_notifications: false,
              reminder_hours: 24,
            }]);
        }
      }
      
      // Close the dialog
      setOpen(false);
      
      // Show success message
      toast.success("Showing Request Submitted", {
        description: "The seller has been notified of your request.",
      });

      // Send an email notification to the seller (in a production app)
      // This would typically be handled by a serverless function or backend service
      
    } catch (error) {
      console.error("Error submitting showing request:", error);
      toast.error("Failed to Submit Request", {
        description: "There was an error submitting your showing request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule a Showing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule a Showing</DialogTitle>
          <DialogDescription>
            Request a time to visit {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        <ShowingRequestForm
          propertyId={propertyId}
          sellerId={sellerId}
          onRequestSubmit={handleShowingRequest}
        />
      </DialogContent>
    </Dialog>
  );
}
