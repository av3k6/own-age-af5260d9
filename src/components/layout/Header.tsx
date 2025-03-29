
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, User, Bell, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center text-xl font-bold text-primary">
            <Home className="w-6 h-6 mr-2" />
            <span>TransacZen Haven</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/buy" className="text-foreground hover:text-primary font-medium">
              Buy
            </Link>
            <Link to="/sell" className="text-foreground hover:text-primary font-medium">
              Sell
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-primary font-medium">
              Professionals
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary font-medium">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 bg-background"
            />
          </div>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user.email?.split('@')[0]}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="ml-2">
                  Log in
                </Button>
              </Link>
              
              <Link to="/signup">
                <Button size="sm">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-3">
          <ThemeToggle />
          <button
            className="text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-background border-b shadow-sm">
          <div className="flex flex-col space-y-3">
            <Link to="/buy" className="text-foreground hover:text-primary py-2">
              Buy
            </Link>
            <Link to="/sell" className="text-foreground hover:text-primary py-2">
              Sell
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-primary py-2">
              Professionals
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary py-2">
                Dashboard
              </Link>
            )}
            
            <div className="relative my-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full bg-background"
              />
            </div>
            
            {user ? (
              <div className="flex flex-col space-y-2 pt-2">
                <div className="text-foreground py-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{user.email?.split('@')[0]}</span>
                </div>
                <Button onClick={handleSignOut} className="flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
