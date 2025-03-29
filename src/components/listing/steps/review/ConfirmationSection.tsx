
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useFormContext } from "../../context/FormContext";

const ConfirmationSection = () => {
  const { formData, updateFormData } = useFormContext();

  const handleConfirmationChange = (checked: boolean) => {
    updateFormData({ confirmationChecked: checked });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="confirmation" 
          checked={formData.confirmationChecked}
          onCheckedChange={handleConfirmationChange}
          className="mt-1"
        />
        <div className="space-y-1">
          <Label 
            htmlFor="confirmation" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I confirm that the information provided is true to the best of my knowledge and is not misleading.
          </Label>
          <p className="text-sm text-muted-foreground">
            By checking this box, you confirm that all information is accurate and complete.
          </p>
        </div>
      </div>
      
      {!formData.confirmationChecked && (
        <div className="text-sm text-amber-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span>You must confirm that the information is accurate before publishing</span>
        </div>
      )}
    </div>
  );
};

export default ConfirmationSection;
