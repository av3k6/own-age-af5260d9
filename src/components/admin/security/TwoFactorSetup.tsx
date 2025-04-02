
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface TwoFactorSetupProps {
  onVerificationSuccess: () => void;
}

const TwoFactorSetup = ({ onVerificationSuccess }: TwoFactorSetupProps) => {
  const { toast } = useToast();
  const { verify2FA, getTwoFactorSecret } = useAdminAuth();
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  const twoFactorSecret = getTwoFactorSecret();

  const verifyTwoFactorCode = async () => {
    setIsVerifying(true);
    try {
      const success = await verify2FA(twoFactorCode);
      
      if (success) {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been enabled successfully.",
        });
        setTwoFactorCode("");
        onVerificationSuccess();
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

  return (
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
                {slots.map((slot, i) => (
                  <InputOTPSlot key={i} {...slot} index={i} />
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
  );
};

export default TwoFactorSetup;
