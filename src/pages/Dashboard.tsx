
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/user/UserProfile";

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
          <p className="text-zinc-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Your Dashboard</h1>
      
      <div className="grid gap-6">
        <UserProfile />
        
        {/* More dashboard sections can be added here */}
      </div>
    </div>
  );
};

export default Dashboard;
