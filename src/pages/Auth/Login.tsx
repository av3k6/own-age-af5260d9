
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { useFormValidation } from "@/hooks/useFormValidation";
import { LoginProgress } from "@/components/auth/LoginProgress";
import { LoginFormFields } from "@/components/auth/LoginFormFields";
import { FormErrorAlert } from "@/components/auth/FormErrorAlert";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authProgress, setAuthProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | undefined>(undefined);
  
  const { toast } = useToast();
  const { signIn, user, isInitialized, sessionStatus, refreshSession } = useAuth();
  const { validateEmail, validatePassword, errors } = useFormValidation();
  const { redirecting, setRedirecting } = useLoginRedirect(user, isInitialized);
  
  const emailError = errors.Email || "";
  const passwordError = errors.Password || "";
  
  useEffect(() => {
    if (sessionStatus === 'expired') {
      setFormError("Your previous session has expired. Please sign in again.");
    }
  }, [sessionStatus]);

  const handleCaptchaVerify = useCallback((token: string) => {
    console.log("Captcha verified with token:", token.substring(0, 10) + "...");
    setCaptchaToken(token);
    // Auto submit the form once captcha is verified
    handleSubmit(new Event("submit") as unknown as React.FormEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    const isEmailValid = validateEmail(email).isValid;
    const isPasswordValid = validatePassword(password).isValid;
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    try {
      setIsLoading(true);
      setAuthProgress(10);
      console.log("Login form submitting with email:", email);
      
      // Fix: Only pass two arguments to signIn as expected by the function
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error details:", error);
        
        // Handle specific captcha error and provide clearer message
        if (error.message?.includes('captcha')) {
          setFormError("Please complete the captcha verification to continue.");
          setCaptchaToken(undefined); // Reset captcha token to trigger a new one
        } else {
          setFormError(error?.message || "Failed to sign in");
        }
        return;
      }
      
      setAuthProgress(95);
      console.log("Login successful, awaiting auth state update");
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
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

  if (!isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-foreground">Preparing authentication system...</p>
        <LoginProgress 
          isLoading={true} 
          authProgress={30} 
          setAuthProgress={() => {}}
        />
      </div>
    );
  }

  return (
    <AuthPageLayout
      title="Welcome back"
      subtitle="Sign in to continue to your TransacZen Haven account"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkTo="/signup"
    >
      <div className="space-y-6">
        <FormErrorAlert error={formError} />
        
        <LoginProgress
          isLoading={isLoading}
          authProgress={authProgress}
          setAuthProgress={setAuthProgress}
        />
        
        <LoginFormFields 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          validateEmail={validateEmail}
          validatePassword={validatePassword}
          emailError={emailError}
          passwordError={passwordError}
          isLoading={isLoading}
          redirecting={redirecting}
          handleSubmit={handleSubmit}
          onCaptchaVerify={handleCaptchaVerify}
        />
      </div>
    </AuthPageLayout>
  );
};

export default Login;
