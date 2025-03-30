import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import { Icons } from "@/components/Icons";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold">Welcome back!</h1>
        <p className="text-zen-gray-500 text-sm">
          Log in to your TransacZen Haven account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-zen-blue-500 focus:border-zen-blue-500 sm:text-sm"
          />
        </div>
        <Button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zen-blue-500 hover:bg-zen-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zen-blue-500"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </Button>
      </form>
      <div className="text-sm text-zen-gray-500">
        <Link to="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </div>

      <SocialLoginButtons />

      <div className="text-center text-sm text-zen-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" className="hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
