
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
import ShowingScheduler from "./ShowingScheduler";
import { formatDate, formatTime } from "@/lib/formatters";
import { Calendar, Clock, User } from "lucide-react";

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
});

interface ShowingRequestFormProps {
  propertyId: string;
  onRequestSubmit: (data: Partial<Showing> & { name: string; email: string; phone: string }) => void;
}

export default function ShowingRequestForm({ propertyId, onRequestSubmit }: ShowingRequestFormProps) {
  const [selectedShowing, setSelectedShowing] = useState<Partial<Showing> | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      notes: "",
    },
  });

  const handleScheduleSelection = (showing: Partial<Showing>) => {
    setSelectedShowing(showing);
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedShowing) {
      onRequestSubmit({
        ...selectedShowing,
        notes: data.notes,
        name: data.name,
        email: data.email,
        phone: data.phone,
      });
    }
  };

  return (
    <div className="space-y-6">
      <ShowingScheduler propertyId={propertyId} onSchedule={handleScheduleSelection} />
      
      {selectedShowing && selectedShowing.startTime && (
        <div className="mt-6">
          <div className="bg-zen-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-zen-blue-800 mb-2">Showing Details</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-zen-gray-600">
                <Calendar className="w-4 h-4 mr-2" /> 
                <span>{formatDate(selectedShowing.startTime)}</span>
              </div>
              <div className="flex items-center text-zen-gray-600">
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
                      <Input placeholder="John Doe" {...field} />
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
                        <Input type="email" placeholder="you@example.com" {...field} />
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
                        <Input placeholder="(555) 123-4567" {...field} />
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
              
              <Button type="submit" className="w-full">
                Request Showing
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
