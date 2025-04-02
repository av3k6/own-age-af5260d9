
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import AssignBusinessOwners from "@/components/admin/AssignBusinessOwners";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminAccountSettings from "@/components/admin/account/AdminAccountSettings";
import AdminSecuritySettings from "@/components/admin/AdminSecuritySettings";

const AdminDashboard = () => {
  const { checkAdminAuth, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("assign-businesses");
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuthenticated = checkAdminAuth();
    
    if (!adminAuthenticated) {
      navigate("/admin/login");
    } else {
      setIsAdmin(true);
    }
  }, [navigate, checkAdminAuth]);

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage system settings and user associations</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="assign-businesses">Assign Business Owners</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assign-businesses">
          <AssignBusinessOwners />
        </TabsContent>
        
        <TabsContent value="account">
          <AdminAccountSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <AdminSecuritySettings />
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Manage global system configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management will be implemented in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
