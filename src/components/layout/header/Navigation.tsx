
import { NavLink } from "react-router-dom";

interface NavigationProps {
  isAuthenticated: boolean;
  className?: string;
}

export const Navigation = ({ isAuthenticated, className = "" }: NavigationProps) => {
  return (
    <nav className={className}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/buy"
        className={({ isActive }) =>
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        Buy
      </NavLink>
      {isAuthenticated && (
        <NavLink
          to="/sell"
          className={({ isActive }) =>
            isActive
              ? "font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground transition-colors"
          }
        >
          Sell
        </NavLink>
      )}
      <NavLink
        to="/professionals"
        className={({ isActive }) =>
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        Professionals
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          isActive
            ? "font-medium text-foreground"
            : "text-muted-foreground hover:text-foreground transition-colors"
        }
      >
        Contact
      </NavLink>
    </nav>
  );
};
