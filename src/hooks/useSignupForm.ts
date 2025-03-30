
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

// Form validation schema
export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum([UserRole.BUYER, UserRole.SELLER, UserRole.PROFESSIONAL]),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const useSignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.BUYER,
      terms: false as unknown as true, // Type assertion to satisfy zod
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Register user using AuthContext
      const { error } = await signUp(values.email, values.password, {
        name: values.name,
        role: values.role,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
      
      // Redirect to login page after successful registration
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit,
  };
};
