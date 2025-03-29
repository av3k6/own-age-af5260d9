
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center text-xl font-bold text-primary">
      <Home className="w-6 h-6 mr-2" />
      <span>TransacZen Haven</span>
    </Link>
  );
};

export default HeaderLogo;
