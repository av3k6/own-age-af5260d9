
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditListingFormValues } from "@/types/edit-listing";
import { PropertyTypeSelect } from "../PropertyTypeSelect";

interface BasicInfoSectionProps {
  form: UseFormReturn<EditListingFormValues>;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Update the basic details of your property listing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Property Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Property Price" 
                  {...field} 
                  onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <PropertyTypeSelect form={form} />
    </>
  );
};
