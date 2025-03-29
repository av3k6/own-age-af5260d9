
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import HeaderLogo from "./header/HeaderLogo";
import ProvinceSelector from "./header/ProvinceSelector";
import Navigation from "./header/Navigation";
import SearchBar from "./header/SearchBar";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm transition-colors duration-300">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-1 pr-4">
          <HeaderLogo />
          
          {/* Province Filter Dropdown - Desktop */}
          {!isMobile && (
            <div className="ml-1">
              <ProvinceSelector className="w-[140px] h-9" />
            </div>
          )}
        </div>
        
        {/* Navigation - Desktop */}
        {!isMobile && (
          <Navigation 
            isAuthenticated={!!user} 
            className="hidden md:flex items-center space-x-6 flex-1 justify-center" 
          />
        )}

        {/* Desktop Menu */}
        {!isMobile && (
          <div className="hidden md:flex items-center gap-1">
            <SearchBar />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <UserMenu />
          </div>
        )}

        {/* Mobile Menu */}
        <MobileMenu isAuthenticated={!!user} />
      </div>
    </header>
  );
};

export default Header;
