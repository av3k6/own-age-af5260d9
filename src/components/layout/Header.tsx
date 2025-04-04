
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="font-bold text-xl">TransacZen Haven</Link>
        
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-foreground hover:text-primary">Home</Link>
          <Link to="/dashboard" className="text-foreground hover:text-primary">Dashboard</Link>
          <Link to="/document-requirements" className="text-foreground hover:text-primary">Document Requirements</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <Link to="/profile" className="text-foreground hover:text-primary">Profile</Link>
          ) : (
            <Link to="/login" className="text-foreground hover:text-primary">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
