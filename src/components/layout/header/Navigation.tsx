
import { Link } from "react-router-dom"
import { Home, ShoppingBag, Store, User, LayoutDashboard } from "lucide-react"

interface NavigationProps {
  isAuthenticated?: boolean;
  className?: string;
}

export function Navigation({ isAuthenticated, className = "" }: NavigationProps) {
  return (
    <nav className={className || "hidden md:flex items-center space-x-6"}>
      <Link
        to="/"
        className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        to="/buy"
        className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
      >
        <ShoppingBag className="h-4 w-4" />
        Buy
      </Link>
      <Link
        to="/sell"
        className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
      >
        <Store className="h-4 w-4" />
        Sell
      </Link>
      <Link
        to="/professionals"
        className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
      >
        <User className="h-4 w-4" />
        Professionals
      </Link>
      
      {isAuthenticated && (
        <Link
          to="/dashboard"
          className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>
      )}
    </nav>
  );
}
