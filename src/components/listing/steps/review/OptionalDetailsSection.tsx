
import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFormContext, PropertyCondition } from "../../context/FormContext";

const OptionalDetailsSection = () => {
  const { formData } = useFormContext();
  const [isOptionalDetailsOpen, setIsOptionalDetailsOpen] = useState(false);

  const getPropertyConditionLabel = (condition: PropertyCondition | undefined) => {
    if (!condition) return "Not specified";
    
    const labels: Record<PropertyCondition, string> = {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      needs_renovation: "Needs Renovation"
    };
    
    return labels[condition];
  };

  return (
    <div className="space-y-2">
      <Collapsible 
        open={isOptionalDetailsOpen} 
        onOpenChange={setIsOptionalDetailsOpen}
        className="border rounded-md"
      >
        <CollapsibleTrigger className="flex justify-between items-center w-full p-4">
          <h3 className="text-lg font-medium">Additional Property Details</h3>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.propertyCondition && (
              <div>
                <p className="text-sm text-muted-foreground">Property Condition</p>
                <p className="font-medium">{getPropertyConditionLabel(formData.propertyCondition)}</p>
              </div>
            )}
            
            {formData.recentUpgrades && (
              <div>
                <p className="text-sm text-muted-foreground">Recent Upgrades</p>
                <p className="font-medium">{formData.recentUpgrades}</p>
              </div>
            )}
            
            {formData.utilityInformation && (
              <div>
                <p className="text-sm text-muted-foreground">Utility Information</p>
                <p className="font-medium">{formData.utilityInformation}</p>
              </div>
            )}
            
            {formData.fees && (
              <div>
                <p className="text-sm text-muted-foreground">HOA/Condo Fees or Property Taxes</p>
                <p className="font-medium">{formData.fees}</p>
              </div>
            )}
            
            {formData.energyEfficient !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Energy Efficient</p>
                <p className="font-medium">{formData.energyEfficient ? "Yes" : "No"}</p>
              </div>
            )}
            
            {formData.parkingDetails && (
              <div>
                <p className="text-sm text-muted-foreground">Parking Details</p>
                <p className="font-medium">{formData.parkingDetails}</p>
              </div>
            )}
            
            {formData.specialAmenities && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Special Amenities or Notes</p>
                <p className="font-medium">{formData.specialAmenities}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default OptionalDetailsSection;
