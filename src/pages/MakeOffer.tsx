
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { mockListings } from "@/data/mockData";

const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be greater than 0",
  }),
  deadline: z.date({
    required_error: "Please select a deadline date.",
  }),
  message: z.string().optional(),
  contingencies: z.array(z.string()).optional(),
});

const contingencyOptions = [
  { id: "financing", label: "Financing Contingency" },
  { id: "inspection", label: "Home Inspection Contingency" },
  { id: "appraisal", label: "Appraisal Contingency" },
  { id: "sale", label: "Home Sale Contingency" },
];

export default function MakeOffer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [property, setProperty] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      message: "",
      contingencies: [],
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      // First check mock data
      const mockProperty = mockListings.find(listing => listing.id === id);
      
      if (mockProperty) {
        setProperty(mockProperty);
        form.setValue("amount", mockProperty.price);
        setIsLoading(false);
        return;
      }
      
      // If not in mock data, fetch from Supabase
      try {
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProperty(data);
          form.setValue("amount", data.price);
        } else {
          navigate("/property-not-found");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        navigate("/property-not-found");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id, supabase, navigate, toast, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!property || !user) {
      toast({
        title: "Error",
        description: "Missing property or user information",
        variant: "destructive",
      });
      return;
    }

    try {
      // Default deadline to 3 days if not specified
      const deadline = values.deadline || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

      // Create the offer in Supabase
      const { error } = await supabase.from("offers").insert({
        property_id: property.id,
        buyer_id: user.id,
        seller_id: property.seller_id,
        amount: values.amount,
        contingencies: values.contingencies,
        deadline: deadline.toISOString(),
        message: values.message,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Offer Submitted",
        description: "Your offer has been sent to the seller.",
      });

      navigate(`/dashboard`);
    } catch (error) {
      console.error("Failed to submit offer:", error);
      toast({
        title: "Failed to Submit Offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Loading...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Property not found.</p>
        <div className="flex justify-center mt-4">
          <Link to="/buy">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to={`/property/${id}`} className="text-zen-blue-500 hover:text-zen-blue-600">
            &larr; Back to Property
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">Make an Offer</h1>
        
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">{property.title}</h2>
          <p className="text-gray-600 mb-4">{property.address?.street}, {property.address?.city}, {property.address?.state}</p>
          <p className="text-xl font-bold text-zen-blue-500">
            Listed for: ${property.price?.toLocaleString()}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Offer Amount ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter your offer amount" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Offer Valid Until</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contingencies"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Contingencies</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {contingencyOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="contingencies"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValues = checked
                                      ? [...(field.value || []), option.id]
                                      : field.value?.filter(
                                          (value) => value !== option.id
                                        ) || [];
                                    field.onChange(updatedValues);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message to Seller (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional details about your offer"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/property/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Offer</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
