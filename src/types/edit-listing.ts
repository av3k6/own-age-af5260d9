
import { PropertyType, ListingStatus } from "./enums";
import * as z from "zod";

export const editListingFormSchema = z.object({
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

export type EditListingFormValues = z.infer<typeof editListingFormSchema>;
