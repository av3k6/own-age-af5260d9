
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

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
    <div className="flex justify-end gap-2">
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button 
          onClick={onEdit}
          variant="outline"
        >
          Edit Profile
          <Edit className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ProfileActions;
