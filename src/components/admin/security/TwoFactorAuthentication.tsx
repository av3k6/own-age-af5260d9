
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Shield, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import TwoFactorSetup from "./TwoFactorSetup";

const TwoFactorAuthentication = () => {
  const { toast } = useToast();
  const { setup2FA, verify2FA, disable2FA, is2FAEnabled, getTwoFactorSecret } = useAdminAuth();
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  
  const twoFactorEnabled = is2FAEnabled();

  const handleToggle2FA = async (enabled: boolean) => {
    if (enabled) {
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

  return (
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
            <TwoFactorSetup 
              onVerificationSuccess={() => setShowTwoFactorSetup(false)} 
            />
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
  );
};

export default TwoFactorAuthentication;
