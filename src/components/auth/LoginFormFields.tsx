
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { ValidationResult } from "@/hooks/useFormValidation";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  validateEmail: (email: string) => ValidationResult;
  validatePassword: (password: string) => ValidationResult;
  emailError: string;
  passwordError: string;
  isLoading: boolean;
  redirecting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const LoginFormFields = ({
  email,
  setEmail,
  password,
  setPassword,
  validateEmail,
  validatePassword,
  emailError,
  passwordError,
  isLoading,
  redirecting,
  handleSubmit
}: LoginFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
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
            className={`pl-10 ${
              emailError ? 'border-red-500' : 'border-gray-300'
            }`}
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
            className={`pl-10 pr-10 ${
              passwordError ? 'border-red-500' : 'border-gray-300'
            }`}
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
  );
};
