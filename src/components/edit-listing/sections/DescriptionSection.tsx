
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditListingFormValues } from "@/types/edit-listing";

interface DescriptionSectionProps {
  form: UseFormReturn<EditListingFormValues>;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({ form }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-2">Property Description</h2>
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your property" 
                className="min-h-[150px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
