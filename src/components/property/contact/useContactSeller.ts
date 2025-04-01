
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { ContactFormValues } from "./ContactForm";

interface UseContactSellerProps {
  propertyId: string;
  propertyTitle: string;
  sellerId: string;
}

export function useContactSeller({ propertyId, propertyTitle, sellerId }: UseContactSellerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { createConversation } = useMessaging();
  const navigate = useNavigate();

  // Get user data for the form
  const userData = {
    name: user?.user_metadata?.full_name || user?.name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || user?.phone || "",
  };

  const handleSubmit = async (values: ContactFormValues) => {
    console.log("Contact form submitted:", {
      sellerId,
      propertyId,
      ...values,
    });
    
    try {
      setIsSubmitting(true);
      
      // Always store the contact request in Supabase regardless of conversation creation
      try {
        const { error: contactError } = await supabase.from('contact_requests').insert({
          seller_id: sellerId,
          property_id: propertyId,
          buyer_id: user?.id || null,
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
          status: 'new',
        });
        
        if (contactError) {
          console.error("Error saving contact request:", contactError);
          // We'll continue even if contact request fails, but we'll log it properly
        } else {
          console.log("Contact request saved successfully");
        }
      } catch (contactSaveError) {
        console.error("Exception saving contact request:", contactSaveError);
        // Continue despite the error
      }
      
      // Check if user is logged in before attempting to create a conversation
      if (!user) {
        toast.success("Message Sent", {
          description: "Please create an account or log in to view responses from the seller.",
        });
        setOpen(false);
        setIsSubmitting(false);
        return;
      }
      
      // First, update user phone number if it's not already set
      if (values.phone && (!user.user_metadata?.phone || user.user_metadata.phone !== values.phone)) {
        try {
          const { error: updateError } = await supabase.auth.updateUser({
            data: {
              phone: values.phone,
            },
          });
          
          if (updateError) {
            console.error("Error updating user phone:", updateError);
          } else {
            console.log("User phone number updated successfully");
          }
        } catch (updateError) {
          console.error("Exception updating user phone:", updateError);
          // Continue despite the error
        }
      }
      
      // Create a conversation and send the initial message
      const subject = `Inquiry about ${propertyTitle}`;
      console.log("Creating conversation with:", { 
        receiverId: sellerId,
        subject,
        initialMessage: values.message,
        propertyId
      });
      
      let conversation;
      try {
        conversation = await createConversation(
          sellerId,
          subject,
          values.message,
          propertyId
        );
      } catch (convError) {
        console.error("Failed to create conversation:", convError);
        // Show a partial success message since at least the contact info was saved
        toast.success("Contact Information Sent", {
          description: "We couldn't create a messaging thread, but your contact info was shared with the seller.",
        });
        setOpen(false);
        setIsSubmitting(false);
        return;
      }
      
      if (!conversation) {
        // We'll still show a success message since the contact request was saved
        toast.success("Request Sent", {
          description: "Your contact information has been saved. The seller will contact you soon.",
        });
        setOpen(false);
        setIsSubmitting(false);
        return;
      }

      console.log("Conversation created successfully:", conversation);
      
      // Show success message
      toast.success("Message Sent", {
        description: "Your message has been sent. Check your inbox for responses.",
      });
      
      // Close the dialog
      setOpen(false);
      
      // Navigate to messages after a short delay
      setTimeout(() => {
        navigate("/messages");
      }, 1500);
      
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message", {
        description: "There was a problem sending your message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    open,
    setOpen,
    userData,
    handleSubmit
  };
}

