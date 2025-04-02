
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import { Room } from "@/types";
import { DocumentMetadata } from "@/types/document";
import { UseFormReset } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";

export function usePropertyFetch(
  propertyId: string | undefined,
  form: { reset: UseFormReset<EditListingFormValues> },
  setBedroomRooms: (rooms: Room[]) => void,
  setOtherRooms: (rooms: Room[]) => void,
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void
) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  
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
  }, [propertyId, supabase, navigate, toast, user, form, setBedroomRooms, setOtherRooms, setFloorPlans]);

  return { isLoading };
}
