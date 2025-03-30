import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyType, ListingStatus, Room } from "@/types";
import { levelOptions } from "@/components/listing/steps/property-features/utils/propertyFeatures";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be greater than 0",
  }),
  propertyType: z.nativeEnum(PropertyType),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  squareFeet: z.coerce.number().positive(),
  yearBuilt: z.coerce.number().int().positive(),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  features: z.string().optional(),
  status: z.nativeEnum(ListingStatus),
});

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [bedroomRooms, setBedroomRooms] = useState<Room[]>([]);
  const [otherRooms, setOtherRooms] = useState<Room[]>([]);
  
  const [roomName, setRoomName] = useState("");
  const [roomLevel, setRoomLevel] = useState(levelOptions[0]);
  const [roomDimensions, setRoomDimensions] = useState("");
  const [roomType, setRoomType] = useState("bedroom");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      propertyType: PropertyType.HOUSE,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      yearBuilt: new Date().getFullYear(),
      street: "",
      city: "",
      state: "",
      zipCode: "",
      features: "",
      status: ListingStatus.ACTIVE,
    },
  });

  useEffect(() => {
    const bedroomCount = form.watch("bedrooms");
    
    if (bedroomCount < bedroomRooms.length) {
      setBedroomRooms(prev => prev.slice(0, bedroomCount));
    }
  }, [form.watch("bedrooms"), bedroomRooms.length]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || !user) return;

      try {
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data.seller_id !== user.id) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to edit this listing.",
            variant: "destructive",
          });
          navigate(`/property/${id}`);
          return;
        }

        if (data.room_details?.bedrooms) {
          setBedroomRooms(data.room_details.bedrooms);
        }
        
        if (data.room_details?.otherRooms) {
          setOtherRooms(data.room_details.otherRooms);
        }

        if (data) {
          form.reset({
            title: data.title,
            description: data.description,
            price: data.price,
            propertyType: data.property_type,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            squareFeet: data.square_feet,
            yearBuilt: data.year_built,
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
            features: data.features?.join(", ") || "",
            status: data.status,
          });
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
  }, [id, supabase, navigate, toast, user, form]);

  const addRoom = () => {
    if (!roomName.trim()) return;
    
    const newRoom: Room = {
      name: roomName,
      level: roomLevel,
      dimensions: roomDimensions.trim() || undefined
    };
    
    if (roomType === "bedroom") {
      if (bedroomRooms.length >= form.getValues("bedrooms")) {
        toast({
          title: "Cannot Add More Bedrooms",
          description: `You've specified ${form.getValues("bedrooms")} bedrooms in total. Increase the bedroom count to add more room details.`,
          variant: "destructive",
        });
        return;
      }
      setBedroomRooms(prev => [...prev, newRoom]);
    } else {
      setOtherRooms(prev => [...prev, newRoom]);
    }
    
    setRoomName("");
    setRoomDimensions("");
  };

  const removeRoom = (index: number, type: "bedroom" | "otherRoom") => {
    if (type === "bedroom") {
      setBedroomRooms(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    } else {
      setOtherRooms(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!id || !user) {
      toast({
        title: "Error",
        description: "Missing property or user information",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const featuresArray = values.features
        ? values.features.split(',').map(item => item.trim())
        : [];

      console.log("Updating listing status to:", values.status);

      const { error } = await supabase
        .from("property_listings")
        .update({
          title: values.title,
          description: values.description,
          price: values.price,
          property_type: values.propertyType,
          bedrooms: values.bedrooms,
          bathrooms: values.bathrooms,
          square_feet: values.squareFeet,
          year_built: values.yearBuilt,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
          },
          features: featuresArray,
          status: values.status,
          room_details: {
            bedrooms: bedroomRooms,
            otherRooms: otherRooms,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("seller_id", user.id)
        .select();

      if (error) throw error;

      toast({
        title: "Listing Updated",
        description: `Your property listing has been updated successfully with status: ${values.status}.`,
      });

      navigate(`/property/${id}`);
    } catch (error: any) {
      console.error("Failed to update listing:", error);
      toast({
        title: "Failed to Update Listing",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center">Loading...</p>
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

        <h1 className="text-2xl font-bold mb-6">Edit Property Listing</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">Basic Details</TabsTrigger>
                <TabsTrigger value="rooms">Room Details</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Modern Beach House" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the property"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propertyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(PropertyType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="squareFeet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearBuilt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Built</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip/Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Features (comma-separated)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Garage, Fireplace, Pool"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={ListingStatus.ACTIVE}>Active</SelectItem>
                            <SelectItem value={ListingStatus.PENDING}>Pending</SelectItem>
                            <SelectItem value={ListingStatus.SOLD}>Sold</SelectItem>
                            <SelectItem value={ListingStatus.EXPIRED}>Expired</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="rooms">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/40 rounded-md">
                    <div className="mb-4">
                      <p className="text-sm mb-2">
                        You have specified <strong>{form.watch("bedrooms")}</strong> bedrooms for this property. 
                        Add details for each bedroom below.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bedroomRooms.length} of {form.watch("bedrooms")} bedrooms have details added.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel htmlFor="roomType">Room Type</FormLabel>
                        <Select
                          value={roomType}
                          onValueChange={setRoomType}
                        >
                          <SelectTrigger id="roomType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bedroom">Bedroom</SelectItem>
                            <SelectItem value="other">Other Room</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="roomName">Room Name</FormLabel>
                        <Input
                          id="roomName"
                          placeholder="e.g. Primary Bedroom"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="roomLevel">Room Level</FormLabel>
                        <Select
                          value={roomLevel}
                          onValueChange={setRoomLevel}
                        >
                          <SelectTrigger id="roomLevel">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {levelOptions.map(level => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <FormLabel htmlFor="roomDimensions">Dimensions</FormLabel>
                        <Input
                          id="roomDimensions"
                          placeholder="e.g. 12 x 14"
                          value={roomDimensions}
                          onChange={(e) => setRoomDimensions(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button type="button" onClick={addRoom} disabled={!roomName}>
                        Add Room
                      </Button>
                    </div>
                  </div>
                  
                  {bedroomRooms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Bedrooms</h4>
                      <div className="space-y-2">
                        {bedroomRooms.map((room, index) => (
                          <div key={`bedroom-${index}`} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{room.name}</p>
                              <p className="text-sm text-muted-foreground">Level: {room.level}{room.dimensions ? `, Dimensions: ${room.dimensions}` : ''}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeRoom(index, "bedroom")}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {otherRooms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Other Rooms</h4>
                      <div className="space-y-2">
                        {otherRooms.map((room, index) => (
                          <div key={`otherRoom-${index}`} className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <p className="font-medium">{room.name}</p>
                              <p className="text-sm text-muted-foreground">Level: {room.level}{room.dimensions ? `, Dimensions: ${room.dimensions}` : ''}</p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeRoom(index, "otherRoom")}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/property/${id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Update Listing"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
