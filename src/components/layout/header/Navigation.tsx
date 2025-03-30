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

export function Navigation() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link
        to="/"
        className="text-base font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        to="/properties"
        className="text-base font-medium transition-colors hover:text-primary"
      >
        Properties
      </Link>
      <Link
        to="/agents"
        className="text-base font-medium transition-colors hover:text-primary"
      >
        Agents
      </Link>
      <Link
        to="/contact"
        className="text-base font-medium transition-colors hover:text-primary"
      >
        Contact
      </Link>
      
      <Link
        to="/documents"
        className="text-base font-medium transition-colors hover:text-primary"
      >
        Documents
      </Link>
      
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
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
          <Link to="/register">
            <Button size="sm">Sign Up</Button>
          </Link>
        </>
      )}
    </nav>
  );
}
