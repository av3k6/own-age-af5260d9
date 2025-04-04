
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
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { createLogger } from "@/utils/logger";

const logger = createLogger("Dashboard");

const Dashboard = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [listingsCount, setListingsCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [showingsCount, setShowingsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is admin (jredmond)
  const isAdmin = user?.email === "jredmond@example.com" || user?.id === "jredmond";
  
  // Check if user is a professional
  const isProfessional = user?.role === "professional";
  
  // Check if user has business assignment (in a real app, we'd fetch this from the database)
  const hasBusinessAssignment = isProfessional; // For simplicity, assume all professionals have a business

  // Fetch actual counts for the dashboard
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      
      try {
        // Fetch property listings count
        const { count: listingsCount, error: listingsError } = await supabase
          .from('property_listings')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id);
          
        if (listingsError) {
          logger.error("Error fetching listings count:", listingsError);
        } else {
          setListingsCount(listingsCount || 0);
        }
        
        // Also try with seller_email
        if (user.email) {
          const { count: emailListingsCount, error: emailError } = await supabase
            .from('property_listings')
            .select('*', { count: 'exact', head: true })
            .eq('seller_email', user.email);
            
          if (!emailError && emailListingsCount && emailListingsCount > 0) {
            // If we found more listings by email, use that count
            setListingsCount(prev => Math.max(prev, emailListingsCount));
          }
        }
        
        // Fetch documents count
        const { count: docsCount, error: docsError } = await supabase
          .from('property_documents')
          .select('*', { count: 'exact', head: true })
          .eq('uploaded_by', user.id);
          
        if (docsError) {
          logger.error("Error fetching documents count:", docsError);
        } else {
          setDocumentsCount(docsCount || 0);
        }
        
        // Fetch viewings/showings count
        const { count: viewingsCount, error: viewingsError } = await supabase
          .from('property_viewings')
          .select('*', { count: 'exact', head: true })
          .eq('buyer_id', user.id)
          .eq('status', 'APPROVED');
          
        if (viewingsError) {
          logger.error("Error fetching viewings count:", viewingsError);
        } else {
          setShowingsCount(viewingsCount || 0);
        }
        
        // Fetch unread messages count
        try {
          const { count: unreadCount, error: unreadError } = await supabase
            .from('conversations')
            .select('*', { count: 'exact', head: true })
            .contains('participants', [user.id])
            .gt('unread_count', 0);
            
          if (!unreadError) {
            setMessagesCount(unreadCount || 0);
          }
        } catch (msgError) {
          logger.error("Error fetching messages count:", msgError);
          // Non-fatal error - continue without messages count
        }
        
      } catch (error) {
        logger.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCounts();
  }, [user, supabase]);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Welcome back, {user?.name || "user"}!
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/dashboard/listings">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{isLoading ? "..." : listingsCount}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "..." : showingsCount}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "..." : documentsCount}</p>
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
              <p className="text-2xl font-bold">{isLoading ? "..." : messagesCount}</p>
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
