
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
  Users,
  File,
  Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { createLogger } from "@/utils/logger";
import { useToast } from "@/hooks/use-toast";
import FavoritePropertiesSection from "@/components/user/favorites/FavoritePropertiesSection";

const logger = createLogger("Dashboard");

const Dashboard = () => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Check if user is admin (jredmond)
  const isAdmin = user?.email === "jredmond@example.com" || user?.id === "jredmond";
  
  // Check if user is a professional
  const isProfessional = user?.role === "professional";
  
  // Check if user has business assignment (in a real app, we'd fetch this from the database)
  const hasBusinessAssignment = isProfessional; // For simplicity, assume all professionals have a business

  // State for actual counts
  const [propertyCount, setPropertyCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [showingsCount, setShowingsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch counts when user is logged in
  useEffect(() => {
    if (!user?.id) return;

    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        // Fetch property listings count
        const { count: propertiesCount, error: propertiesError } = await supabase
          .from("property_listings")
          .select("*", { count: "exact", head: true })
          .eq("seller_id", user.id);
        
        if (propertiesError) {
          logger.error("Error fetching property count:", propertiesError);
          toast({
            title: "Error",
            description: "Could not retrieve property listings",
            variant: "destructive"
          });
        } else {
          setPropertyCount(propertiesCount || 0);
        }
        
        // Fetch documents count
        const { data: documents, error: documentsError } = await supabase
          .from("property_documents")
          .select("id")
          .eq("uploaded_by", user.id);
        
        if (documentsError) {
          logger.error("Error fetching documents count:", documentsError);
        } else {
          setDocumentsCount(documents?.length || 0);
        }
        
        // Fetch showings count
        const { data: showings, error: showingsError } = await supabase
          .from("property_viewings")
          .select("id")
          .eq("seller_id", user.id)
          .eq("status", "PENDING");
        
        if (showingsError) {
          logger.error("Error fetching showings count:", showingsError);
        } else {
          setShowingsCount(showings?.length || 0);
        }
        
        // Fetch unread messages count
        const { data: conversations, error: conversationsError } = await supabase
          .from("conversations")
          .select("id, unread_count")
          .contains("participants", [user.id]);
        
        if (conversationsError) {
          logger.error("Error fetching messages count:", conversationsError);
        } else {
          // Sum up unread counts across conversations
          const unreadCount = conversations?.reduce((total, convo) => 
            total + (convo.unread_count || 0), 0) || 0;
          setMessagesCount(unreadCount);
        }
        
        // Fetch favorites count
        const { count: favoriteCount, error: favoritesError } = await supabase
          .from("property_favorites")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
          
        if (favoritesError) {
          logger.error("Error fetching favorites count:", favoritesError);
        } else {
          setFavoritesCount(favoriteCount || 0);
          setShowFavorites(favoriteCount > 0);
        }
      } catch (error) {
        logger.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Could not retrieve dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [user, supabase, toast]);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Welcome back, {user?.name || "user"}!
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Link to="/dashboard/listings">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Properties</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{isLoading ? "..." : propertyCount}</p>
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
        
        <Link to="/favorites" onClick={(e) => {
          e.preventDefault();
          setShowFavorites(!showFavorites);
        }}>
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorite Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{isLoading ? "..." : favoritesCount}</p>
              <p className="text-xs text-muted-foreground">Properties you've saved</p>
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
        
        {/* New card for Document Requirements */}
        <Link to="/document-requirements">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Document Requirements</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View required documents for listing your property by province</p>
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
      
      {/* Favorites Section - conditionally rendered */}
      {showFavorites && (
        <div className="mb-12">
          <FavoritePropertiesSection />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
