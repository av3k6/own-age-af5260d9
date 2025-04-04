
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { EditListingFormValues } from "@/types/edit-listing";

interface FeaturesSectionProps {
  form: UseFormReturn<EditListingFormValues>;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ form }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-2">Features</h2>
      </div>
      
      <FormField
        control={form.control}
        name="features"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Features (comma separated)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="e.g. Garage, Fireplace, Pool" 
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
