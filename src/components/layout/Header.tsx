
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, User, Bell, Menu, LogOut, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { provinces } from "@/utils/provinceData";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user's full name from metadata or fall back to email username
  const userDisplayName = user?.user_metadata?.full_name || 
                          (user?.email ? user.email.split('@')[0] : 'User');

  // Load saved province from localStorage on component mount
  useEffect(() => {
    const savedProvince = localStorage.getItem("selectedProvince");
    if (savedProvince) {
      setSelectedProvince(savedProvince);
    }
  }, []);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    // Save to localStorage for persistence
    localStorage.setItem("selectedProvince", value);
    // If we're not on the homepage, navigate there to see filtered properties
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

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
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm transition-colors duration-300">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center text-xl font-bold text-primary">
            <Home className="w-6 h-6 mr-2" />
            <span>TransacZen Haven</span>
          </Link>
          
          {/* Province Filter Dropdown */}
          <div className="hidden md:flex ml-2">
            <Select value={selectedProvince} onValueChange={handleProvinceChange}>
              <SelectTrigger className="w-[140px] h-9 bg-background/50 dark:bg-background/30 border-primary/20">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <SelectValue placeholder="Select province" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border-primary/20">
                <SelectGroup>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/buy" className="text-foreground hover:text-primary font-medium transition-colors">
              Buy
            </Link>
            <Link to="/sell" className="text-foreground hover:text-primary font-medium transition-colors">
              Sell
            </Link>
            <Link to="/professionals" className="text-foreground hover:text-primary font-medium transition-colors">
              Professionals
            </Link>
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary font-medium transition-colors">
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
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 bg-background text-foreground transition-colors"
            />
          </div>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{userDisplayName}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="ml-2 text-foreground hover:text-primary transition-colors">
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
          {/* Province dropdown for mobile */}
          <div className="mr-1">
            <Select value={selectedProvince} onValueChange={handleProvinceChange}>
              <SelectTrigger className="w-[90px] h-8 bg-background/50 dark:bg-background/30 border-primary/20">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  <SelectValue placeholder="Province" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border-primary/20">
                <SelectGroup>
                  {provinces.map((province) => (
                    <SelectItem key={province.value} value={province.value}>
                      {province.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <ThemeToggle />
          <button
            className="text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
            {user && (
              <Link to="/dashboard" className="text-foreground hover:text-primary py-2 transition-colors">
                Dashboard
              </Link>
            )}
            
            <div className="relative my-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full bg-background text-foreground transition-colors"
              />
            </div>
            
            {user ? (
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
