
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditListingFormValues } from "@/types/edit-listing";
import { PropertyTypeSelect } from "./PropertyTypeSelect";
import { StatusSelector } from "./StatusSelector";
import { ListingStatus } from "@/types";
import { useListingStatus } from "@/hooks/edit-listing/useListingStatus";

interface BasicDetailsTabProps {
  form: UseFormReturn<EditListingFormValues>;
}

const BasicDetailsTab: React.FC<BasicDetailsTabProps> = ({ form }) => {
  const currentStatus = form.watch("status");
  const { originalStatus, getOriginalStatus } = useListingStatus(undefined);
  
  useEffect(() => {
    getOriginalStatus();
  }, []);
  
  // Status is locked if it's EXPIRED
  const isStatusLocked = currentStatus === ListingStatus.EXPIRED;

  return (
    <div className="space-y-6">
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

      <div className="grid gap-6 md:grid-cols-3">
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Number of Bedrooms"
                  {...field}
                  onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                />
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
                <Input 
                  type="number" 
                  placeholder="Number of Bathrooms"
                  step="0.5"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
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
                <Input 
                  type="number" 
                  placeholder="Total Square Feet"
                  {...field}
                  onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="yearBuilt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Year Built</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Year Built"
                {...field}
                onChange={e => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Address</h2>
      </div>
      
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street</FormLabel>
            <FormControl>
              <Input placeholder="Street Address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <Input placeholder="State/Province" {...field} />
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
                <Input placeholder="Zip/Postal Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Listing Status</h2>
      </div>
      
      <StatusSelector form={form} isStatusLocked={isStatusLocked} />
    </div>
  );
};

export default BasicDetailsTab;
