
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyType } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";

interface PropertyTypeSelectProps {
  form: UseFormReturn<EditListingFormValues>;
}

export const PropertyTypeSelect: React.FC<PropertyTypeSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="propertyType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Type</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
                  <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
                  <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
                  <SelectItem value={PropertyType.TOWNHOUSE}>Townhouse</SelectItem>
                  <SelectItem value={PropertyType.LAND}>Land</SelectItem>
                  <SelectItem value={PropertyType.COMMERCIAL}>Commercial</SelectItem>
                  <SelectItem value={PropertyType.OTHER}>Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
