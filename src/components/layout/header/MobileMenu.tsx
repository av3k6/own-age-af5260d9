
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import ProvinceSelector from "./ProvinceSelector";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface MobileMenuProps {
  isAuthenticated: boolean;
}

const MobileMenu = ({ isAuthenticated }: MobileMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Province dropdown for mobile */}
        <div className="mr-1">
          <ProvinceSelector className="w-[90px] h-8" />
        </div>
        
        <ThemeToggle />
        <button
          className="text-foreground transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-background border-b shadow-sm transition-colors">
          <div className="flex flex-col space-y-3">
            <Link to="/buy" className="text-foreground hover:text-primary py-2 transition-colors">
              Buy
            </Link>
            <Link to="/sell" className="text-foreground hover:text-primary py-2 transition-colors">
              Sell
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-primary py-2 transition-colors">
              Professionals
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-foreground hover:text-primary py-2 transition-colors">
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
