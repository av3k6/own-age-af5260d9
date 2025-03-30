
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, email, setEmail, password, setPassword, isLoading }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-zen-gray-700">
          Email address
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-zen-gray-700">
          Password
        </Label>
        <div className="mt-1 relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <RememberMeOption />

        <div className="text-sm">
          <Link to="/forgot-password" className="font-medium text-zen-blue-600 hover:text-zen-blue-500">
            Forgot your password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zen-blue-500 hover:bg-zen-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-blue-500"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>
    </form>
  );
};

const RememberMeOption = () => {
  return (
    <div className="flex items-center">
      <input
        id="remember-me"
        name="remember-me"
        type="checkbox"
        className="h-4 w-4 text-zen-blue-600 focus:ring-zen-blue-500 border-gray-300 rounded"
      />
      <Label htmlFor="remember-me" className="ml-2 block text-sm text-zen-gray-900">
        Remember me
      </Label>
    </div>
  );
};

export default LoginForm;
