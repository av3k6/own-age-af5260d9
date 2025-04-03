
import React, { useEffect } from "react";
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
  
  // Only block changes if we're trying to change FROM expired TO something else
  // We want to allow changing TO expired from any status
  const preventStatusChange = isStatusLocked && currentStatus === ListingStatus.EXPIRED;
  
  // If status is locked, show a toast when user tries to change it away from EXPIRED
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "status" && preventStatusChange && value.status !== ListingStatus.EXPIRED) {
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
  }, [form, preventStatusChange, toast]);

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
