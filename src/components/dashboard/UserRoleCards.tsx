
import { Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types";

interface UserRoleCardsProps {
  user: User | null;
  isProfessional: boolean;
  isAdmin: boolean;
  hasBusinessAssignment: boolean;
}

export const UserRoleCards = ({ 
  user, 
  isProfessional, 
  isAdmin, 
  hasBusinessAssignment 
}: UserRoleCardsProps) => {
  return (
    <>
      {/* Admin Dashboard Card - Only visible to admin user */}
      {isAdmin && (
        <Link to="/admin/dashboard">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admin Dashboard</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Manage users, businesses, and system settings</p>
            </CardContent>
          </Card>
        </Link>
      )}
      
      {/* Business Management Card - Only visible to professionals assigned to a business */}
      {isProfessional && hasBusinessAssignment && (
        <Link to="/business/edit">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Business Management</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Manage your business profile and services</p>
            </CardContent>
          </Card>
        </Link>
      )}
    </>
  );
};

export default UserRoleCards;
