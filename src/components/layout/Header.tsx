
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "./header/Navigation";
import HeaderLogo from "./header/HeaderLogo";
import UserMenu from "./header/UserMenu";
import MobileMenu from "./header/MobileMenu";
import ProvinceSelector from "./header/ProvinceSelector";
import ThemeToggle from "@/components/theme/ThemeToggle";

const Header = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const unreadMessageCount = 0; // This would typically be fetched from a real data source
  
  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-4">
          <HeaderLogo />
          <ProvinceSelector className="hidden md:flex" />
        </div>
        
        <Navigation 
          isAuthenticated={isAuthenticated} 
          className="hidden md:flex space-x-6"
        />
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserMenu />
          <MobileMenu 
            isAuthenticated={isAuthenticated}
            unreadMessageCount={unreadMessageCount}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
