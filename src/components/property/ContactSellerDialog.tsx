
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";

interface ContactSellerDialogProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactSellerDialog({ 
  propertyId, 
  propertyTitle,
  sellerId 
}: ContactSellerDialogProps) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || user?.name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || user?.phone || "",
      message: `Hi, I'm interested in ${propertyTitle}. I would like more information.`,
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // In a production app, this would send the message to the seller via your backend
    console.log("Contact form submitted:", {
      sellerId,
      propertyId,
      ...values,
    });
    
    try {
      // Example of storing the contact request in Supabase
      // You would typically create a 'contact_requests' table in your database
      const { error } = await supabase.from('contact_requests').insert({
        seller_id: sellerId,
        property_id: propertyId,
        buyer_id: user?.id || null,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        status: 'new',
      });
      
      if (error) throw error;
      
      toast.success("Message Sent", {
        description: "The seller has been notified and will contact you soon.",
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Failed to send contact request:", error);
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Mail className="h-4 w-4 mr-2" />
          Contact Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Send a message to the seller about {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="I'm interested in this property and would like more information."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-2">
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
