
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Home, User, Bell, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center text-xl font-bold text-zen-blue-500">
            <Home className="w-6 h-6 mr-2" />
            <span>TransacZen Haven</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/buy" className="text-zen-gray-600 hover:text-zen-blue-500 font-medium">
              Buy
            </Link>
            <Link to="/sell" className="text-zen-gray-600 hover:text-zen-blue-500 font-medium">
              Sell
            </Link>
            <Link to="/professionals" className="text-zen-gray-600 hover:text-zen-blue-500 font-medium">
              Professionals
            </Link>
            <Link to="/dashboard" className="text-zen-gray-600 hover:text-zen-blue-500 font-medium">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-zen-blue-500 w-64"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Link to="/login">
            <Button variant="ghost" size="sm" className="ml-2">
              Log in
            </Button>
          </Link>
          
          <Link to="/signup">
            <Button size="sm" className="bg-zen-blue-500 hover:bg-zen-blue-600">
              Sign up
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden text-zen-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-b shadow-sm">
          <div className="flex flex-col space-y-3">
            <Link to="/buy" className="text-zen-gray-600 hover:text-zen-blue-500 py-2">
              Buy
            </Link>
            <Link to="/sell" className="text-zen-gray-600 hover:text-zen-blue-500 py-2">
              Sell
            </Link>
            <Link to="/professionals" className="text-zen-gray-600 hover:text-zen-blue-500 py-2">
              Professionals
            </Link>
            <Link to="/dashboard" className="text-zen-gray-600 hover:text-zen-blue-500 py-2">
              Dashboard
            </Link>
            
            <div className="relative my-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-zen-blue-500 w-full"
              />
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Link to="/login" className="w-1/2">
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              
              <Link to="/signup" className="w-1/2">
                <Button className="w-full bg-zen-blue-500 hover:bg-zen-blue-600">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
