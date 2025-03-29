
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderLogoProps {
  className?: string;
}

const HeaderLogo = ({ className }: HeaderLogoProps) => {
  return (
    <Link 
      to="/" 
      className={cn(
        "flex items-center text-xl font-bold text-primary pl-0 hover:opacity-90 transition-opacity",
        className
      )}
    >
      <div className="flex items-center justify-center bg-primary/10 p-1.5 rounded-md mr-2">
        <Home className="w-5 h-5 text-primary" />
      </div>
      <span className="hidden sm:inline">TransacZen Haven</span>
      <span className="inline sm:hidden">TZH</span>
    </Link>
  );
};

export default HeaderLogo;
