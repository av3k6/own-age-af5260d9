import React, { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Mail, Phone, Clock, ChevronDown, ChevronUp, Search, 
  MessageSquare, Copy, CheckCircle, AlertCircle 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Contact form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message cannot exceed 1000 characters" }),
  sendCopy: z.boolean().default(false),
  contactMethod: z.enum(["email", "phone", "either"]).default("email"),
  bestTimeToContact: z.enum(["morning", "afternoon", "evening", "anytime"]).default("anytime"),
});

type FormValues = z.infer<typeof formSchema>;

// FAQ data
const faqs = [
  {
    question: "How do I list my property on your platform?",
    answer: "You can list your property by creating an account, navigating to the 'Sell' page, and following the step-by-step listing process. You'll need property details, photos, and pricing information."
  },
  {
    question: "What fees are associated with using your service?",
    answer: "Our basic listing service is free. Premium features like featured listings, professional photography, and advanced marketing tools are available for a fee. Please check our pricing page for current rates."
  },
  {
    question: "How long does it take for my listing to appear on the site?",
    answer: "Standard listings typically appear within 24 hours after submission. Premium listings are prioritized and usually appear within 2-4 hours."
  },
  {
    question: "Can I edit my listing after it's published?",
    answer: "Yes, you can edit most aspects of your listing at any time through your dashboard. Some changes may require review by our team before appearing live."
  },
  {
    question: "How do I schedule a showing for a property?",
    answer: "You can schedule a showing by navigating to the property listing page and clicking the 'Schedule Showing' button. You'll be prompted to select available dates and times."
  },
  {
    question: "What happens after I submit an offer through your platform?",
    answer: "After submitting an offer, the seller and their agent will be notified. They can then accept, reject, or counter your offer through our system. You'll receive notifications on the status of your offer."
  },
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking 'Forgot Password' on the login page. We'll send a password reset link to your registered email address."
  }
];

const Contact: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const supportEmail = "support@realestatemarketplace.com";
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Form with default values from user context if available
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.user_metadata?.name || "",
      email: user?.email || "",
      phone: user?.user_metadata?.phone || "",
      subject: "",
      message: "",
      sendCopy: false,
      contactMethod: "email",
      bestTimeToContact: "anytime",
    },
  });

  // Filter FAQs based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredFaqs(faqs);
      return;
    }
    
    const filtered = faqs.filter(
      (faq) => 
        faq.question.toLowerCase().includes(query) || 
        faq.answer.toLowerCase().includes(query)
    );
    setFilteredFaqs(filtered);
  };

  // Copy email to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(supportEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Email Copied",
      description: "Support email has been copied to clipboard",
    });
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            subject: data.subject,
            message: data.message,
            user_id: user?.id || null,
            preferred_contact: data.contactMethod,
            best_time: data.bestTimeToContact,
          }
        ]);
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond soon!",
        variant: "default",
      });
      
      // Send copy to user if requested
      if (data.sendCopy) {
        // This would typically call an API endpoint to send an email
        console.log("Sending copy to user:", data.email);
      }
      
      // Reset form
      form.reset({
        name: user?.user_metadata?.name || "",
        email: user?.email || "",
        phone: user?.user_metadata?.phone || "",
        subject: "",
        message: "",
        sendCopy: false,
        contactMethod: "email",
        bestTimeToContact: "anytime",
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save contact preferences
  const saveContactPreferences = async (contactMethod: string, bestTime: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your contact preferences.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          preferred_contact_method: contactMethod,
          preferred_contact_time: bestTime
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Preferences Saved",
        description: "Your contact preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Chat functionality
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    // Scroll to bottom of chat when opened
    if (!isChatOpen) {
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Contact Us | Real Estate Marketplace</title>
        <meta name="description" content="Contact our support team for help with your real estate needs." />
      </Helmet>

      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative rounded-lg overflow-hidden h-64 md:h-80 mb-8">
          <img 
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
            alt="Customer support team" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
            <div className="px-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                We're here to help with your real estate journey. Reach out with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Name <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Email <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="(123) 456-7890" 
                              {...field} 
                              onChange={(e) => {
                                // Basic phone number formatting
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length > 0) {
                                  if (value.length <= 3) {
                                    value = `(${value}`;
                                  } else if (value.length <= 6) {
                                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                                  } else {
                                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                                  }
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            Subject <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                                <SelectItem value="Technical Support">Technical Support</SelectItem>
                                <SelectItem value="Billing Question">Billing Question</SelectItem>
                                <SelectItem value="Property Listing Issue">Property Listing Issue</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
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
                        <FormLabel className="flex items-center">
                          Message <span className="text-red-500 ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="resize-none min-h-[150px]" 
                              {...field} 
                              maxLength={1000}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                              {field.value.length}/1000
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sendCopy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Send me a copy of this message</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin mr-2">
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </span>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Contact Info & Preferences */}
        <div className="space-y-6">
          {/* Direct Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach us directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">Email Support</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">{supportEmail}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0" 
                      onClick={copyToClipboard}
                      aria-label="Copy email address"
                    >
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">Phone Support</p>
                  <a 
                    href="tel:+15551234567" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">Monday - Friday: 9AM - 6PM EST</p>
                  <p className="text-sm text-muted-foreground">Saturday: 10AM - 4PM EST</p>
                  <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Expected Response Time:</span> Within 24 hours on business days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Preferences</CardTitle>
              <CardDescription>How would you like us to reach you?</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select contact method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="phone">Phone</SelectItem>
                              <SelectItem value="either">Either</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bestTimeToContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Best Time to Contact</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time preference" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                              <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                              <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                              <SelectItem value="anytime">Anytime</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="button"
                    className="w-full mt-2"
                    onClick={() => saveContactPreferences(
                      form.getValues("contactMethod"),
                      form.getValues("bestTimeToContact")
                    )}
                    disabled={!user}
                  >
                    Save Preferences
                  </Button>
                  
                  {!user && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Please sign in to save your contact preferences.
                    </p>
                  )}
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No matching FAQs found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </section>

      {/* Live Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <Button
            onClick={toggleChat}
            size="lg"
            className="rounded-full h-14 w-14 p-0 shadow-lg"
            aria-label="Live Chat"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          
          {/* Online indicator */}
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
        </div>
        
        {/* Chat Dialog */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 bg-card border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between bg-primary p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  <h3 className="font-medium text-primary-foreground">Live Support</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-primary-foreground opacity-70 hover:opacity-100" 
                  onClick={toggleChat}
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </Button>
              </div>
              
              <div className="p-4 h-80 overflow-y-auto">
                <div className="flex flex-col space-y-3">
                  <div className="bg-muted p-3 rounded-lg rounded-bl-none max-w-[80%]">
                    <p className="text-sm">Hello! How can I help you today with your real estate needs?</p>
                    <span className="text-xs text-muted-foreground block mt-1">Support Agent • Just now</span>
                  </div>
                  
                  <div className="text-center my-2">
                    <span className="text-xs text-muted-foreground">Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div ref={messageEndRef}></div>
                </div>
              </div>
              
              <div className="border-t p-3">
                <form className="flex space-x-2">
                  <Input 
                    className="flex-1" 
                    placeholder="Type your message..." 
                  />
                  <Button type="submit">Send</Button>
                </form>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  This is a placeholder for future chat implementation
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Contact;
