import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { PropertyType, ListingStatus, Room } from "@/types";
import { DocumentMetadata } from "@/types/document";

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

export type EditListingFormValues = z.infer<typeof formSchema>;

export const useEditListing = (propertyId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bedroomRooms, setBedroomRooms] = useState<Room[]>([]);
  const [otherRooms, setOtherRooms] = useState<Room[]>([]);
  const [floorPlans, setFloorPlans] = useState<DocumentMetadata[]>([]);

  const form = useForm<EditListingFormValues>({
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
      if (!propertyId || !user) return;

      try {
        const { data, error } = await supabase
          .from("property_listings")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (error) throw error;

        if (data.seller_id !== user.id) {
          toast({
            title: "Permission Denied",
            description: "You don't have permission to edit this listing.",
            variant: "destructive",
          });
          navigate(`/property/${propertyId}`);
          return;
        }

        if (data.room_details?.bedrooms) {
          setBedroomRooms(data.room_details.bedrooms);
        }
        
        if (data.room_details?.otherRooms) {
          setOtherRooms(data.room_details.otherRooms);
        }

        try {
          const { data: documentsData, error: documentsError } = await supabase
            .from("property_documents")
            .select("*")
            .eq("property_id", propertyId)
            .eq("document_type", "floor_plan");
          
          if (documentsError) {
            console.log("Property documents table may not exist:", documentsError);
            
            if (data.floor_plans && Array.isArray(data.floor_plans)) {
              setFloorPlans(data.floor_plans);
            }
          } else if (documentsData && documentsData.length > 0) {
            setFloorPlans(documentsData as unknown as DocumentMetadata[]);
          }
        } catch (docError) {
          console.error("Error fetching floor plans:", docError);
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
  }, [propertyId, supabase, navigate, toast, user, form]);

  const saveProperty = async (values: EditListingFormValues) => {
    if (!propertyId || !user) {
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

      const updateData = {
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
          otherRooms: otherRooms
        },
        floor_plans: floorPlans,
        updated_at: new Date().toISOString(),
      };
      
      try {
        const { error } = await supabase
          .from("property_listings")
          .update(updateData)
          .eq("id", propertyId)
          .eq("seller_id", user.id);
          
        if (error) throw error;

        try {
          for (const floorPlan of floorPlans) {
            if (!floorPlan.id || !floorPlan.id.includes('/')) continue;
            
            const documentData = {
              id: floorPlan.id.replace(/\//g, '_'),
              name: floorPlan.name,
              url: floorPlan.url,
              type: floorPlan.type,
              size: floorPlan.size,
              property_id: propertyId,
              uploaded_by: user.id,
              document_type: "floor_plan",
              path: floorPlan.path,
              created_at: floorPlan.createdAt
            };

            const { data: existingDoc, error: checkError } = await supabase
              .from("property_documents")
              .select("id")
              .eq("property_id", propertyId)
              .eq("path", floorPlan.path)
              .maybeSingle();

            if (!checkError) {
              if (existingDoc) {
                await supabase
                  .from("property_documents")
                  .update(documentData)
                  .eq("id", existingDoc.id);
              } else {
                await supabase
                  .from("property_documents")
                  .insert(documentData);
              }
            }
          }
        } catch (documentError) {
          console.warn("Could not save to property_documents table:", documentError);
        }
          
        toast({
          title: "Listing Updated",
          description: `Your property listing has been updated successfully with status: ${values.status}.`,
        });
        
        navigate(`/property/${propertyId}`);
      } catch (initialError: any) {
        if (initialError.message && initialError.message.includes("room_details")) {
          const { room_details, ...dataWithoutRoomDetails } = updateData;
          
          console.log("Retrying update without room_details field");
          const { error } = await supabase
            .from("property_listings")
            .update(dataWithoutRoomDetails)
            .eq("id", propertyId)
            .eq("seller_id", user.id);
            
          if (error) throw error;
          
          toast({
            title: "Listing Updated",
            description: `Your property listing has been updated successfully with status: ${values.status}.`,
          });
          
          navigate(`/property/${propertyId}`);
        } else {
          throw initialError;
        }
      }
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

  return {
    form,
    isLoading,
    isSaving,
    bedroomRooms,
    setBedroomRooms,
    otherRooms,
    setOtherRooms,
    floorPlans,
    setFloorPlans,
    saveProperty
  };
};
