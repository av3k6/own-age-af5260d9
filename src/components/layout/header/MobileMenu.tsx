
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, ShoppingBag, Store, LayoutDashboard, User, Bell } from "lucide-react";
import ProvinceSelector from "./ProvinceSelector";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

const MobileMenu = ({ isAuthenticated }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  if (!isMobile) return null;

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Province dropdown for mobile */}
        <div className="mr-1">
          <ProvinceSelector className="w-[90px] h-8" />
        </div>
        
        {user && (
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        )}
        
        <ThemeToggle />
        <button
          className="text-foreground transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu dropdown - Fixed positioning to prevent cutoff */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-background border-b shadow-md transition-colors">
          <div className="px-4 py-3 flex flex-col space-y-3">
            <Link to="/" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/buy" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Buy
            </Link>
            <Link to="/sell" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
              <Store className="h-4 w-4" />
              Sell
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
              <User className="h-4 w-4" />
              Professionals
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-foreground hover:text-primary py-2 transition-colors flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            
            <div className="relative my-2">
              <SearchBar />
            </div>
            
            <UserMenu isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
