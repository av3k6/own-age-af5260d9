
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ListingStatus } from "@/types";
import { useFormContext } from "../../context/FormContext";

const ListingStatusSection = () => {
  const { formData, updateFormData } = useFormContext();

  const handleStatusChange = (status: ListingStatus) => {
    updateFormData({ status });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-medium">Listing Status</h3>
      <RadioGroup 
        defaultValue={formData.status}
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
    </div>
  );
};

export default ListingStatusSection;
