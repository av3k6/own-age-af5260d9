
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, user, isInitialized } = useAuth();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check environment for debugging
  useEffect(() => {
    console.log("Environment info:", {
      isDevelopment: import.meta.env.DEV, 
      mode: import.meta.env.MODE,
      base: import.meta.env.BASE_URL
    });
  }, []);
  
  // Improved redirect if already logged in
  useEffect(() => {
    if (!isInitialized) {
      // Wait for auth to initialize before making decisions
      console.log("Auth not yet initialized, waiting...");
      return;
    }
    
    if (user) {
      const redirectTo = location.state?.from || "/dashboard";
      console.log("User already logged in, redirecting to:", redirectTo);
      navigate(redirectTo, { replace: true });
    } else {
      console.log("No user found after auth initialized");
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
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        throw error;
      }
      
      console.log("Sign in successful, navigating to dashboard");
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      // Get destination from location state or default to dashboard
      const redirectTo = location.state?.from || "/dashboard";
      console.log("Redirecting to:", redirectTo);
      
      // Use shorter delay for better user experience
      setTimeout(() => {
        console.log("Executing delayed navigation to:", redirectTo);
        navigate(redirectTo, { replace: true });
      }, 500);
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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Initiating Google sign in");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      console.log("Google sign in initiated:", data);
    } catch (error: any) {
      console.error("Google sign in error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsLoading(true);
      console.log("Initiating Facebook sign in");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
      console.log("Facebook sign in initiated:", data);
    } catch (error: any) {
      console.error("Facebook sign in error:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to sign in with Facebook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue to your TransacZen Haven account"
      footerText=""
      footerLinkText=""
      footerLinkTo=""
    >
      <LoginForm 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onGoogleSignIn={handleGoogleSignIn}
        onFacebookSignIn={handleFacebookSignIn}
      />
    </AuthPageLayout>
  );
};

export default Login;
