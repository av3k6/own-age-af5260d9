
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getFeatureIcon } from "@/utils/featureIcons";

interface FeatureCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export const FeatureCheckbox = ({ id, label, checked, onToggle }: FeatureCheckboxProps) => {
  const FeatureIcon = getFeatureIcon(label);

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id}
        checked={checked}
        onCheckedChange={onToggle}
      />
      <div className="flex items-center space-x-2">
        <FeatureIcon className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      </div>
    </div>
  );
};
