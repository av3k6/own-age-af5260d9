
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Showing } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate, formatTime } from "@/lib/formatters";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import ShowingScheduler from "./ShowingScheduler";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  notes: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms to schedule a showing.",
  }),
  agreeToNotifications: z.boolean().optional(),
});

interface ShowingRequestFormProps {
  propertyId: string;
  sellerId: string;
  onRequestSubmit: (data: any) => void;
}

export default function ShowingRequestForm({ 
  propertyId, 
  sellerId, 
  onRequestSubmit 
}: ShowingRequestFormProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [selectedShowing, setSelectedShowing] = useState<Partial<Showing> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      notes: "",
      agreeToTerms: false,
      agreeToNotifications: true,
    },
  });

  const handleScheduleSelection = (showing: Partial<Showing>) => {
    setSelectedShowing(showing);
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!selectedShowing || !selectedShowing.startTime || !selectedShowing.endTime) {
      toast({
        title: "Error",
        description: "Please select an available time slot",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the viewing request data
      const viewingRequest = {
        property_id: propertyId,
        seller_id: sellerId,
        buyer_id: user?.id || "",
        requested_date: formatDate(selectedShowing.startTime),
        requested_time_start: formatTime(selectedShowing.startTime, true),
        requested_time_end: formatTime(selectedShowing.endTime, true),
        status: 'PENDING',
        buyer_name: formData.name,
        buyer_email: formData.email,
        buyer_phone: formData.phone,
        buyer_notes: formData.notes,
        is_virtual: false
      };
      
      // Save the viewing request to Supabase
      const { data, error } = await supabase
        .from('property_viewings')
        .insert([viewingRequest])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your viewing request has been submitted",
      });
      
      // Pass the data to the parent component
      onRequestSubmit({
        ...viewingRequest,
        id: data[0].id
      });
    } catch (error) {
      console.error("Error submitting viewing request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your viewing request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ShowingScheduler 
        propertyId={propertyId} 
        sellerId={sellerId}
        onSchedule={handleScheduleSelection} 
      />
      
      {selectedShowing && selectedShowing.startTime && (
        <div className="mt-6">
          <div className="bg-primary/10 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-primary mb-2">Selected Showing Time</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-4 h-4 mr-2" /> 
                <span>{formatDate(selectedShowing.startTime)}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-2" /> 
                <span>{formatTime(selectedShowing.startTime)} - {formatTime(selectedShowing.endTime as Date)}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        <Input placeholder="John Doe" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input placeholder="(555) 123-4567" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special requests or questions for the seller?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Let the seller know if you have any special requirements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I agree to the showing terms and conditions
                      </FormLabel>
                      <FormDescription>
                        By scheduling a showing, you agree to arrive on time and respect the property.
                      </FormDescription>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreeToNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I would like to receive notifications about this showing
                      </FormLabel>
                      <FormDescription>
                        You'll receive email updates about your showing request status and reminders.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Request..." : "Request Showing"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
