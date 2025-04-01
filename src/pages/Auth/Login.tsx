
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/Icons";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [formError, setFormError] = useState("");
  
  const { toast } = useToast();
  const { signIn, user, isInitialized, sessionStatus, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("Login page rendering with state:", { isInitialized, hasUser: !!user, sessionStatus });

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    setEmailError("");
    return true;
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    
    setPasswordError("");
    return true;
  };
  
  // Simulate auth progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading && authProgress < 90) {
      interval = setInterval(() => {
        setAuthProgress((prev) => {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 300);
    } else if (!isLoading && authProgress > 0) {
      // Complete the progress bar when loading finishes
      interval = setInterval(() => {
        setAuthProgress((prev) => {
          if (prev < 100) {
            return Math.min(prev + 10, 100);
          }
          return 0; // Reset after complete
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isLoading, authProgress]);
  
  const handleRedirect = useCallback(() => {
    if (user) {
      setRedirecting(true);
      setAuthProgress(100);
      const from = location.state?.from?.pathname || "/dashboard";
      console.log("User authenticated, redirecting to:", from);
      
      // Slight delay to ensure state updates complete
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 300);
    }
  }, [user, navigate, location.state]);
  
  // Handle redirect if user is already logged in
  useEffect(() => {
    if (isInitialized && user && !redirecting) {
      handleRedirect();
    }
  }, [user, isInitialized, handleRedirect, redirecting]);
  
  // Handle session status changes
  useEffect(() => {
    if (sessionStatus === 'expired') {
      setFormError("Your previous session has expired. Please sign in again.");
    }
  }, [sessionStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      setAuthProgress(10); // Start progress
      console.log("Login form submitting with email:", email);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        setFormError(error?.message || "Failed to sign in");
        return;
      }
      
      setAuthProgress(95);
      console.log("Login successful, awaiting auth state update");
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Explicit session refresh
      if (refreshSession) {
        await refreshSession();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while auth is initializing
  if (!isInitialized) {
    console.log("Auth not initialized yet, showing loading state");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-foreground">Preparing authentication system...</p>
        <Progress value={30} className="w-64" />
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
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        {authProgress > 0 && (
          <Progress value={authProgress} className="h-1" />
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                className={`pl-10 appearance-none block w-full px-3 py-2 border ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                autoComplete="email"
                disabled={isLoading || redirecting}
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>
          
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) validatePassword(e.target.value);
                }}
                onBlur={(e) => validatePassword(e.target.value)}
                className={`pl-10 appearance-none block w-full px-3 py-2 border ${
                  passwordError ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                autoComplete="current-password"
                disabled={isLoading || redirecting}
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
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
          
          <div className="text-sm text-right">
            <Link to="/forgot-password" className="hover:underline text-primary">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={isLoading || redirecting}
          >
            {(isLoading || redirecting) && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {redirecting ? "Redirecting..." : isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </AuthPageLayout>
  );
};

export default Login;
