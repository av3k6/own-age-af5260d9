
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onCreateListing: () => void;
};

export const EmptyState = ({ onCreateListing }: EmptyStateProps) => {
  const { user } = useAuth();
  
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">You don't have any property listings yet.</p>
      <p className="text-sm text-muted-foreground mb-4">
        If you believe you should see listings here, they might have been created with a different account.
        <br/>
        Current user ID: {user?.id || 'not logged in'}
        <br/>
        Email: {user?.email || 'no email'}
      </p>
      <Button onClick={onCreateListing} variant="outline">
        Create Your First Listing
      </Button>
    </div>
  );
};
