
import React from "react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext, PropertyCondition } from "../context/FormContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useForm } from "react-hook-form";

export default function OptionalPropertyDetails() {
  const { formData, updateFormData } = useFormContext();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const form = useForm({
    defaultValues: {
      propertyCondition: formData.propertyCondition || undefined,
      recentUpgrades: formData.recentUpgrades || "",
      utilityInformation: formData.utilityInformation || "",
      fees: formData.fees || "",
      energyEfficient: formData.energyEfficient || false,
      parkingDetails: formData.parkingDetails || "",
      specialAmenities: formData.specialAmenities || ""
    }
  });

  const handleDataChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="mt-8 border rounded-lg p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full justify-between items-center text-left">
          <h3 className="text-lg font-medium">Additional Property Details (Optional)</h3>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4 space-y-6">
          <Form {...form}>
            <div className="space-y-4">
              <FormItem className="space-y-2">
                <FormLabel>Property Condition</FormLabel>
                <Select
                  value={formData.propertyCondition}
                  onValueChange={(value) => handleDataChange('propertyCondition', value as PropertyCondition)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="needs_renovation">Needs Renovation</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
              
              <FormItem className="space-y-2">
                <FormLabel>Recent Upgrades or Renovations</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any recent improvements or renovations"
                    value={formData.recentUpgrades || ''}
                    onChange={(e) => handleDataChange('recentUpgrades', e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  List major renovations, their dates, and approximate costs if available
                </FormDescription>
              </FormItem>
              
              <FormItem className="space-y-2">
                <FormLabel>Utility Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Information about utilities (providers, average costs)"
                    value={formData.utilityInformation || ''}
                    onChange={(e) => handleDataChange('utilityInformation', e.target.value)}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="space-y-2">
                <FormLabel>HOA/Condo Fees or Property Taxes</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Amount and frequency (e.g., $250/month for HOA)"
                    value={formData.fees || ''}
                    onChange={(e) => handleDataChange('fees', e.target.value)}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="flex flex-row items-center justify-between space-x-2">
                <FormLabel>Energy Efficient Features</FormLabel>
                <FormControl>
                  <Switch
                    checked={formData.energyEfficient || false}
                    onCheckedChange={(checked) => handleDataChange('energyEfficient', checked)}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="space-y-2">
                <FormLabel>Parking Details</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Number of spots, covered parking, etc."
                    value={formData.parkingDetails || ''}
                    onChange={(e) => handleDataChange('parkingDetails', e.target.value)}
                  />
                </FormControl>
              </FormItem>
              
              <FormItem className="space-y-2">
                <FormLabel>Special Amenities or Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Proximity to schools, public transport, or any known issues"
                    value={formData.specialAmenities || ''}
                    onChange={(e) => handleDataChange('specialAmenities', e.target.value)}
                  />
                </FormControl>
                <FormDescription>
                  Include any unique aspects or important disclosures about the property
                </FormDescription>
              </FormItem>
            </div>
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
