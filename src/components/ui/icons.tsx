
import { LogOut, Loader2 } from "lucide-react";

// Create a proper spinner component
const Spinner = () => (
  <Loader2 className="animate-spin h-4 w-4" />
);

export const Icons = {
  logout: LogOut,
  spinner: Spinner,
};
