
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/user/UserProfile";
import UserListings from "@/components/user/UserListings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Home } from "lucide-react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container py-10">
        <div className="w-full h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Your Dashboard</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto mb-6 grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Listings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        
        <TabsContent value="listings">
          <UserListings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
