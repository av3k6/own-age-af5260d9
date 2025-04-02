
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield, Key, Lock, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const AdminSecuritySettings = () => {
  const { toast } = useToast();
  const { resetAdminPassword, setup2FA, verify2FA, disable2FA, is2FAEnabled, getTwoFactorSecret } = useAdminAuth();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Check if 2FA is enabled from localStorage
  const twoFactorEnabled = is2FAEnabled();
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      const success = await resetAdminPassword(data.currentPassword, data.newPassword);
      
      if (success) {
        toast({
          title: "Password Updated",
          description: "Your password has been updated successfully.",
        });
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Password Update Failed",
          description: "The current password is incorrect or there was an error.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleToggle2FA = async (enabled: boolean) => {
    if (enabled) {
      // Enable 2FA flow
      const secret = await setup2FA();
      if (secret) {
        setShowTwoFactorSetup(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to set up two-factor authentication.",
          variant: "destructive",
        });
      }
    } else {
      // Disable 2FA flow
      const success = await disable2FA();
      if (success) {
        toast({
          title: "2FA Disabled",
          description: "Two-factor authentication has been disabled.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to disable two-factor authentication.",
          variant: "destructive",
        });
      }
    }
  };

  const verifyTwoFactorCode = async () => {
    setIsVerifying(true);
    try {
      const success = await verify2FA(twoFactorCode);
      
      if (success) {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been enabled successfully.",
        });
        setShowTwoFactorSetup(false);
        setTwoFactorCode("");
      } else {
        toast({
          title: "Verification Failed",
          description: "The verification code is incorrect or expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying 2FA code:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Get 2FA secret for QR code if available
  const twoFactorSecret = getTwoFactorSecret();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> Password Settings
          </CardTitle>
          <CardDescription>
            Update your admin password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your current password" 
                        {...field}
                        disabled={isPasswordLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Enter your new password" 
                        {...field}
                        disabled={isPasswordLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password"
                        placeholder="Confirm your new password" 
                        {...field}
                        disabled={isPasswordLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPasswordLoading} className="w-full">
                {isPasswordLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Enable two-factor authentication to add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled ? 
                  "Currently enabled. Disable to remove the second authentication step." : 
                  "When enabled, you'll need to enter a code from your authenticator app when logging in."}
              </p>
            </div>
            <Switch 
              checked={twoFactorEnabled || showTwoFactorSetup} 
              onCheckedChange={handleToggle2FA}
            />
          </div>

          {showTwoFactorSetup && (
            <div className="mt-6 space-y-6">
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Setup Two-Factor Authentication</h3>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    1. Download an authenticator app like Google Authenticator or Authy
                  </p>
                  <p className="text-sm">
                    2. Scan this QR code with your authenticator app
                  </p>
                  
                  <div className="flex justify-center my-4">
                    <div className="p-4 bg-white border rounded-md">
                      {/* This would be replaced with an actual QR code in production */}
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-500">QR Code Placeholder</span>
                        <p className="text-xs text-center mt-2 break-all">
                          {twoFactorSecret ? `Secret Key: ${twoFactorSecret}` : "Loading secret..."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm">
                    3. Enter the 6-digit verification code from your authenticator app
                  </p>
                  
                  <div className="mt-4 flex flex-col items-center space-y-4">
                    <InputOTP 
                      maxLength={6}
                      value={twoFactorCode}
                      onChange={setTwoFactorCode}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                    
                    <Button 
                      onClick={verifyTwoFactorCode} 
                      disabled={twoFactorCode.length !== 6 || isVerifying}
                      className="w-full"
                    >
                      {isVerifying ? "Verifying..." : "Verify & Enable 2FA"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground mb-2">
            <Smartphone className="h-4 w-4 inline-block mr-1" />
            If you lose access to your authentication device, you won't be able to log in.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSecuritySettings;
