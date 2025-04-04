
import { 
  Home, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings 
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import UserRoleCards from "./UserRoleCards";
import { User } from "@/types";

interface DashboardCardGridProps {
  user: User | null;
  isAdmin: boolean;
  isProfessional: boolean;
  hasBusinessAssignment: boolean;
  listingsCount: number | string;
  documentsCount: number | string;
  showingsCount: number | string;
  messagesCount: number | string;
  isLoading: boolean;
}

const DashboardCardGrid = ({ 
  user,
  isAdmin,
  isProfessional,
  hasBusinessAssignment,
  listingsCount,
  documentsCount,
  showingsCount,
  messagesCount,
  isLoading
}: DashboardCardGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <DashboardCard 
        title="My Properties"
        value={isLoading ? "..." : listingsCount}
        icon={Home}
        description="Properties you're managing"
        to="/dashboard/listings"
      />
      
      <DashboardCard 
        title="Scheduled Showings"
        value={isLoading ? "..." : showingsCount}
        icon={Calendar}
        description="Upcoming property showings"
        to="/showings"
      />
      
      <DashboardCard 
        title="Documents"
        value={isLoading ? "..." : documentsCount}
        icon={FileText}
        description="Documents requiring attention"
        to="/documents"
      />
      
      <DashboardCard 
        title="Messages"
        value={isLoading ? "..." : messagesCount}
        icon={MessageSquare}
        description="Unread messages"
        to="/messages"
      />
      
      <DashboardCard 
        title="Profile Settings"
        icon={Settings}
        description="Update your personal information and preferences"
        to="/profile"
      />
      
      <UserRoleCards 
        user={user}
        isAdmin={isAdmin}
        isProfessional={isProfessional}
        hasBusinessAssignment={hasBusinessAssignment}
      />
    </div>
  );
};

export default DashboardCardGrid;
