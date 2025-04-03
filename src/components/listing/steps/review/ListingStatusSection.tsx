
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ListingStatus } from "@/types";
import { useFormContext } from "../../context/FormContext";
import { createLogger } from "@/utils/logger";

const logger = createLogger("ListingStatusSection");

const ListingStatusSection = () => {
  const { formData, updateFormData } = useFormContext();
  
  logger.info("Current listing status:", formData.status);

  const handleStatusChange = (status: ListingStatus) => {
    logger.info("Changing listing status to:", status);
    updateFormData({ status });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-medium">Listing Status</h3>
      <RadioGroup 
        defaultValue={formData.status}
        value={formData.status} // Add this to ensure the component reflects the current status
        onValueChange={(value) => handleStatusChange(value as ListingStatus)}
        className="space-y-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={ListingStatus.ACTIVE} id="active" />
          <Label htmlFor="active" className="cursor-pointer">
            <span className="font-medium">Active</span> - Immediately visible to all users
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={ListingStatus.PENDING} id="pending" />
          <Label htmlFor="pending" className="cursor-pointer">
            <span className="font-medium">Pending</span> - Hidden until you activate it
          </Label>
        </div>
      </RadioGroup>
      
      {formData.status === ListingStatus.ACTIVE && (
        <div className="text-sm text-muted-foreground">
          <p className="mt-2">
            Note: Active listings are immediately visible to all users. 
          </p>
        </div>
      )}
      
      {formData.status === ListingStatus.PENDING && (
        <div className="text-sm text-muted-foreground">
          <p className="mt-2">
            Note: Pending listings are only visible to you as the owner. You can activate them later when you're ready.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListingStatusSection;
