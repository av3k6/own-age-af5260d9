
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, User, Shield } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const { loginAsAdmin, isLoading, checkAdminAuth, verify2FA } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkAdminAuth()) {
      navigate("/admin/dashboard");
    }
  }, [navigate, checkAdminAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showTwoFactor) {
      const success = await verify2FA(twoFactorCode);
      if (success) {
        navigate("/admin/dashboard");
      }
    } else {
      const success = await loginAsAdmin(username, password);
      
      if (success && localStorage.getItem("admin_session")) {
        const adminSession = JSON.parse(localStorage.getItem("admin_session") || "{}");
        if (adminSession.twoFactorEnabled) {
          setShowTwoFactor(true);
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            {showTwoFactor 
              ? "Enter the verification code from your authenticator app" 
              : "Enter your credentials to access the admin panel"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {showTwoFactor ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <div className="text-center mb-6">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Open your authenticator app and enter the 6-digit code
                  </p>
                </div>
                <div className="flex justify-center my-4">
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
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="Enter your admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading || (showTwoFactor && twoFactorCode.length !== 6)}>
              {isLoading ? "Verifying..." : (showTwoFactor ? "Verify Code" : "Login as Admin")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
