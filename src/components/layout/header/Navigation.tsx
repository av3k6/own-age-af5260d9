
import { Link } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
  className?: string;
}

const Navigation = ({ isAuthenticated, className = "" }: NavigationProps) => {
  return (
    <nav className={`${className}`}>
      <Link to="/buy" className="text-foreground hover:text-primary font-medium transition-colors">
        Buy
      </Link>
      <Link to="/sell" className="text-foreground hover:text-primary font-medium transition-colors">
        Sell
      </Link>
      <Link to="/professionals" className="text-foreground hover:text-primary font-medium transition-colors">
        Professionals
      </Link>
      {isAuthenticated && (
        <Link to="/dashboard" className="text-foreground hover:text-primary font-medium transition-colors">
          Dashboard
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
