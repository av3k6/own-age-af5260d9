
import { Button } from "@/components/ui/button";
import { Edit, Save, Loader2 } from "lucide-react";

interface ProfileActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ProfileActions = ({
  isEditing,
  isLoading,
  onEdit,
  onCancel,
  onSave
}: ProfileActionsProps) => {
  return (
    <div className="flex w-full justify-end gap-2">
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-24"
          >
            {isLoading ? 'Please wait...' : 'Cancel'}
          </Button>
          <Button 
            onClick={onSave}
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </>
      ) : (
        <Button 
          onClick={onEdit}
          variant="outline"
          className="min-w-32"
        >
          Edit Profile
          <Edit className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
