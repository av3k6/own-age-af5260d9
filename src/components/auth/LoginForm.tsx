import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import { Icons } from "@/components/Icons";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import PasswordInput from "./PasswordInput";

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
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  console.log("LoginForm rendering with props:", { 
    hasExternalSubmit: !!onSubmit,
    hasExternalEmail: externalEmail !== undefined,
    externalIsLoading
  });

  const isLoading = externalIsLoading !== undefined ? externalIsLoading : localIsLoading;
  const email = externalEmail !== undefined ? externalEmail : localEmail;
  const password = externalPassword !== undefined ? externalPassword : localPassword;
  const setEmail = externalSetEmail || setLocalEmail;
  const setPassword = externalSetPassword || setLocalPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("LoginForm handleSubmit called");
    
    if (onSubmit) {
      console.log("Using external submit handler");
      await onSubmit(e);
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
        console.log("SignIn successful!");
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  console.log("LoginForm finished rendering setup, returning JSX");
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Mail size={18} />
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          <Link to="/forgot-password" className="hover:underline text-primary">
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <SocialLoginButtons 
        onGoogleSignIn={onGoogleSignIn}
        onFacebookSignIn={onFacebookSignIn}
        isLoading={isLoading}
      />

      <div className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
