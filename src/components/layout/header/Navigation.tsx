
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface NavigationProps {
  isAuthenticated: boolean;
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ isAuthenticated, className }) => {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList className="flex items-center">
        <NavigationMenuItem>
          <NavLink
            to="/"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            Home
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/buy"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            Buy
          </NavLink>
        </NavigationMenuItem>
        {isAuthenticated && (
          <NavigationMenuItem>
            <NavLink
              to="/sell"
              className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
            >
              Sell
            </NavLink>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavLink
            to="/about"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            About
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/professionals"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            Professionals
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/contact"
            className={({ isActive }) => `px-3 py-2 text-sm font-medium ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}
          >
            Contact
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-2">
          <ThemeToggle />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
