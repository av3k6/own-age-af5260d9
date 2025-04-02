
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, MessageSquare, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  isMobile?: boolean;
}

const UserMenu = ({ isMobile = false }: UserMenuProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get user's display name from available sources
  const userDisplayName = user?.name || 
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
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="ghost" size="sm" className="text-foreground hover:text-primary transition-colors">
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
        
        <Link to="/profile" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </Link>

        <Link to="/dashboard" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
        
        <Link to="/messages" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Messages
        </Link>
        
        <Link to="/settings" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        
        <Button onClick={handleSignOut} className="flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.profileImage} alt={userDisplayName} />
            <AvatarFallback>{userDisplayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{userDisplayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/messages" className="flex items-center gap-2 cursor-pointer">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
