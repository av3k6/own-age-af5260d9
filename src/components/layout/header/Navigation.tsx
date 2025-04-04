
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface NavigationProps {
  isAuthenticated: boolean;
  className?: string;
}

export function Navigation({ isAuthenticated, className }: NavigationProps) {
  return (
    <nav className={cn("items-center", className)}>
      <Link to="/buy" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors">
        Buy
      </Link>
      <Link to="/sell" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors">
        Sell
      </Link>
      <Link to="/professionals" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors">
        Professionals
      </Link>
      <Link to="/mortgage-calculator" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors flex items-center">
        <Calculator className="h-4 w-4 mr-1" />
        Mortgage
      </Link>
      <Link to="/about" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors">
        About
      </Link>
      <Link to="/contact" className="text-foreground/70 hover:text-foreground font-medium px-2 py-1 transition-colors">
        Contact
      </Link>
    </nav>
  );
}
