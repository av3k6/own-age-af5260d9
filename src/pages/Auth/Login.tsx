
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Login page rendering with state:", { isInitialized, hasUser: !!user });
  
  // Handle redirect if user is already logged in
  useEffect(() => {
    console.log("Login useEffect triggered:", { isInitialized, hasUser: !!user, from: location.state?.from?.pathname });
    if (isInitialized && user) {
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("User already logged in, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, isInitialized, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Login form submitting with email:", email);
      
      const { error, data } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        toast({
          title: "Login Error",
          description: error?.message || "Failed to sign in",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Login successful, awaiting auth state update");
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Navigate after successful login
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Error",
        description: error?.message || "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while auth is initializing
  if (!isInitialized) {
    console.log("Auth not initialized yet, showing loading state");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("Rendering login form");
  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue to your TransacZen Haven account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
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
              className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <div 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <EyeOff size={18} className="text-gray-400 hover:text-gray-500" /> : 
                <Eye size={18} className="text-gray-400 hover:text-gray-500" />
              }
            </div>
          </div>
          
          <div className="text-sm text-right">
            <Link to="/forgot-password" className="hover:underline text-primary">
              Forgot password?
            </Link>
          </div>
          
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
      </div>
    </AuthPageLayout>
  );
};

export default Login;
