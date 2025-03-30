import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import { useSupabase } from "@/hooks/useSupabase";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
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

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.BUYER,
      terms: false,
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

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to sign up with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to sign up with Facebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="name"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    autoComplete="email"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a:</FormLabel>
                <FormControl>
                  <RadioGroup 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="flex space-x-2"
                  >
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value={UserRole.BUYER} id="buyer" />
                      <Label htmlFor="buyer" className="cursor-pointer">Buyer</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value={UserRole.SELLER} id="seller" />
                      <Label htmlFor="seller" className="cursor-pointer">Seller</Label>
                    </div>
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value={UserRole.PROFESSIONAL} id="professional" />
                      <Label htmlFor="professional" className="cursor-pointer">Professional</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-zen-blue-600 focus:ring-zen-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="terms" className="ml-2 block text-sm text-zen-gray-900">
                    I agree to the{" "}
                    <Link to="/terms" className="font-medium text-zen-blue-600 hover:text-zen-blue-500">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="font-medium text-zen-blue-600 hover:text-zen-blue-500">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zen-blue-500 hover:bg-zen-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>

      <SocialLoginButtons 
        onGoogleSignIn={handleGoogleSignUp}
        onFacebookSignIn={handleFacebookSignUp}
        isLoading={isLoading}
      />
    </>
  );
};

export default SignupForm;
