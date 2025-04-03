
import React, { useEffect, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingStatus } from "@/types";
import { UseFormReturn } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";
import { useToast } from "@/hooks/use-toast";
import { LockIcon } from "lucide-react";

interface StatusSelectorProps {
  form: UseFormReturn<EditListingFormValues>;
  isStatusLocked: boolean;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({ form, isStatusLocked }) => {
  const { toast } = useToast();
  const currentStatus = form.watch("status");
  const [initialRender, setInitialRender] = useState(true);
  
  // After initial render, it's safe to check for status changes
  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
      return;
    }
  }, []);

  // Only block changes if the listing is expired
  const preventStatusChange = isStatusLocked;
  
  useEffect(() => {
    if (!initialRender) {
      const subscription = form.watch((value, { name }) => {
        if (name === "status" && preventStatusChange) {
          toast({
            title: "Status Locked",
            description: "This listing has expired and its status can only be changed by admin staff.",
            variant: "destructive"
          });
          
          // Reset to "EXPIRED" status
          form.setValue("status", ListingStatus.EXPIRED);
        }
      });
      
      return () => subscription.unsubscribe();
    }
  }, [form, preventStatusChange, toast, initialRender]);

  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Listing Status</FormLabel>
          <FormControl>
            <div className="relative">
              <Select
                disabled={preventStatusChange}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={ListingStatus.ACTIVE}>Active</SelectItem>
                    <SelectItem value={ListingStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={ListingStatus.SOLD}>Sold</SelectItem>
                    <SelectItem value={ListingStatus.EXPIRED}>Expired</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              
              {preventStatusChange && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
                  <LockIcon size={16} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
