
import { useState } from "react";
import { Menu, X, Home, Search, User, Settings, LogOut, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ProvinceSelector from "./ProvinceSelector";
import { Navigation } from "./Navigation";
import ThemeToggle from "@/components/theme/ThemeToggle";
import SearchBar from "./SearchBar";
import { Badge } from "@/components/ui/badge";

interface MobileMenuProps {
  isAuthenticated: boolean;
  unreadMessageCount?: number;
}

const MobileMenu = ({ isAuthenticated, unreadMessageCount = 0 }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate('/login');
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex md:hidden">
      <SearchBar />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="flex justify-between items-center">
              Menu <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
            </SheetTitle>
          </SheetHeader>

          <div className="py-4">
            <ProvinceSelector className="w-full mb-4" />

            <div className="space-y-1 mt-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                asChild
                onClick={handleLinkClick}
              >
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>

              <Navigation
                isAuthenticated={isAuthenticated}
                className="flex flex-col space-y-1"
                onClick={handleLinkClick}
              />

              {isAuthenticated && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start relative"
                    asChild
                    onClick={handleLinkClick}
                  >
                    <Link to="/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      {unreadMessageCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto" 
                        >
                          {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={handleLinkClick}
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    onClick={handleLinkClick}
                  >
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-center">
              <ThemeToggle />
              {!isAuthenticated && (
                <div className="space-x-2">
                  <Button size="sm" variant="outline" asChild onClick={handleLinkClick}>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild onClick={handleLinkClick}>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
