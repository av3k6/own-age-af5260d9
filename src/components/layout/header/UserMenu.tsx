
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserMenuProps {
  isMobile?: boolean;
}

const UserMenu = ({ isMobile = false }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user's full name from metadata or fall back to email username
  const userDisplayName = user?.user_metadata?.full_name || user?.name || 
                          (user?.email ? user.email.split('@')[0] : 'User');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    if (isMobile) {
      return (
        <div className="flex space-x-2 pt-2">
          <Link to="/login" className="w-1/2">
            <Button variant="outline" className="w-full">
              Log in
            </Button>
          </Link>
          
          <Link to="/signup" className="w-1/2">
            <Button className="w-full">
              Sign up
            </Button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="flex items-center">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="ml-1 text-foreground hover:text-primary transition-colors">
            Log in
          </Button>
        </Link>
        
        <Link to="/signup">
          <Button size="sm">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2 pt-2">
        <div className="text-foreground py-2 flex items-center gap-2 transition-colors">
          <User className="h-4 w-4" />
          <span>{userDisplayName}</span>
        </div>
        <Button onClick={handleSignOut} className="flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
        <User className="h-4 w-4" />
        <span className="text-sm font-medium">{userDisplayName}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
        <LogOut className="h-4 w-4" />
        <span>Sign out</span>
      </Button>
    </div>
  );
};

export default UserMenu;
