
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";
import ListingForm from "@/components/listing/ListingForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Sell = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  // Check if user has seller role - update to check user_metadata
  const isSellerRole = user?.user_metadata?.role === UserRole.SELLER || user?.user_metadata?.role === "seller";

  if (loading) {
    return (
      <div className="container py-10">
        <div className="w-full h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not a seller, show upgrade prompt
  if (user && !isSellerRole) {
    return (
      <div className="container py-10">
        <div className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Seller Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Your current account type doesn't have permission to create property listings. 
            Please upgrade your account to seller status.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">Sell Your Property</h1>
      {user && isSellerRole && <ListingForm />}
    </div>
  );
};

export default Sell;
