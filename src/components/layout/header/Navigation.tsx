
import { Link } from "react-router-dom"
import { Icons } from "@/components/ui/icons"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bell, Home, ShoppingBag, Store, User, LayoutDashboard } from "lucide-react"

interface NavigationProps {
  isAuthenticated?: boolean;
  className?: string;
}

export function Navigation({ isAuthenticated, className = "" }: NavigationProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

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
      
      {user || isAuthenticated ? (
        <>
          <Link
            to="/dashboard"
            className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/messages"
            className="text-base font-medium transition-colors hover:text-primary flex items-center gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            Messages
          </Link>
        </>
      ) : null}
      
      {user || isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="grid gap-2 px-2">
              <DropdownMenuItem>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/messages">Messages</Link>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut();
                navigate("/login");
              }}
            >
              Sign out
              <Icons.logout className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Link to="/login">
            <Button size="sm" variant="ghost">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </>
      )}
    </nav>
  );
}
