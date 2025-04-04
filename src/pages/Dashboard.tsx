
import { useAuth } from "@/contexts/AuthContext";
import { createLogger } from "@/utils/logger";
import DashboardCardGrid from "@/components/dashboard/DashboardCardGrid";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const logger = createLogger("Dashboard");

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    listingsCount, 
    documentsCount,
    showingsCount, 
    messagesCount,
    isLoading 
  } = useDashboardData(user);
  
  // Check if user is admin (jredmond)
  const isAdmin = user?.email === "jredmond@example.com" || user?.id === "jredmond";
  
  // Check if user is a professional
  const isProfessional = user?.role === "professional";
  
  // Check if user has business assignment (in a real app, we'd fetch this from the database)
  const hasBusinessAssignment = isProfessional; // For simplicity, assume all professionals have a business

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Welcome back, {user?.name || "user"}!
      </p>
      
      <DashboardCardGrid 
        user={user}
        isAdmin={isAdmin}
        isProfessional={isProfessional}
        hasBusinessAssignment={hasBusinessAssignment}
        listingsCount={listingsCount}
        documentsCount={documentsCount}
        showingsCount={showingsCount}
        messagesCount={messagesCount}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
