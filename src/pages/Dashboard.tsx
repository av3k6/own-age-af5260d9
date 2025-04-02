
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Settings,
  Building2,
  Users
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Check if user is admin (jredmond)
  const isAdmin = user?.email === "jredmond@example.com" || user?.id === "jredmond";
  
  // Check if user is a professional
  const isProfessional = user?.role === "professional";
  
  // Check if user is assigned to any business (in a real app, we'd fetch this from the database)
  const hasBusinessAssignment = isProfessional; // For simplicity, assume all professionals have a business

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Welcome back, {user?.name || "user"}!
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/property/123">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Properties you're managing</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/showings">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Showings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted-foreground">Upcoming property showings</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/documents">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Documents requiring attention</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/messages">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/profile">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Update your personal information and preferences</p>
            </CardContent>
          </Card>
        </Link>
        
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
      </div>
    </div>
  );
};

export default Dashboard;
