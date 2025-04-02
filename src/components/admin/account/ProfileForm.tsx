
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Save, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminProfile } from "@/types/admin";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  initialData: AdminProfile | null;
  onSubmit: (data: FormValues) => Promise<void>;
  isLoading: boolean;
}

const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialData?.username || "",
      email: initialData?.email || "",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your admin username" 
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                This is your admin login username
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter your email address" 
                    className="pl-8"
                    {...field}
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Your email address is used for notifications and account recovery
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
