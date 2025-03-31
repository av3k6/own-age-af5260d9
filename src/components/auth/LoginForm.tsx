
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import { Icons } from "@/components/Icons";

interface LoginFormProps {
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  onGoogleSignIn?: () => Promise<void>;
  onFacebookSignIn?: () => Promise<void>;
  email?: string;
  setEmail?: React.Dispatch<React.SetStateAction<string>>;
  password?: string;
  setPassword?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
}

const LoginForm = ({
  onSubmit,
  onGoogleSignIn,
  onFacebookSignIn,
  email: externalEmail,
  setEmail: externalSetEmail,
  password: externalPassword,
  setPassword: externalSetPassword,
  isLoading: externalIsLoading,
}: LoginFormProps = {}) => {
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [localEmail, setLocalEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Use external state if provided, otherwise use local state
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : localIsLoading;
  const email = externalEmail !== undefined ? externalEmail : localEmail;
  const password = externalPassword !== undefined ? externalPassword : localPassword;
  const setEmail = externalSetEmail || setLocalEmail;
  const setPassword = externalSetPassword || setLocalPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      // If external submit handler is provided, use that
      try {
        await onSubmit(e);
      } catch (error) {
        console.error("External submit handler failed:", error);
        toast({
          title: "Error",
          description: "Login process failed. Please try again later.",
          variant: "destructive",
        });
      }
      return;
    }

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLocalIsLoading(true);

    try {
      console.log("Local login handler executing with email:", email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error("SignIn error:", error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        });
      } else {
        console.log("SignIn successful, preparing to navigate...");
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        
        // Get destination from location state or default to dashboard
        const redirectTo = location.state?.from || "/dashboard";
        console.log("LoginForm redirecting to:", redirectTo);
        
        // Use shorter delay for navigation
        setTimeout(() => {
          console.log("Executing navigation to:", redirectTo);
          navigate(redirectTo, { replace: true });
        }, 100); // Reduced from 500ms to 100ms for better UX
      }
    } catch (error) {
      console.error("LoginForm local handler error:", error);
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLocalIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (onGoogleSignIn) {
      await onGoogleSignIn();
      return;
    }
    // Default implementation if not provided
  };

  const handleFacebookSignIn = async () => {
    if (onFacebookSignIn) {
      await onFacebookSignIn();
      return;
    }
    // Default implementation if not provided
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
            autoComplete="email"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
            autoComplete="current-password"
          />
        </div>
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zen-blue-500 hover:bg-zen-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-blue-500"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
      <div className="text-sm text-zen-gray-500">
        <Link to="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </div>

      <SocialLoginButtons 
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
      />

      <div className="text-center text-sm text-zen-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
