import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "../../../context/FormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { commonPropertyFeatures } from "../utils/propertyFeatures";
import { icons } from "lucide-react";
import { getFeatureIcon } from "@/utils/featureIcons";

const FeaturesTab = () => {
  const { formData, updateFormData } = useFormContext();
  const [customFeature, setCustomFeature] = useState("");

  const toggleFeature = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter(f => f !== feature)
      : [...formData.features, feature];
    
    updateFormData({ features: updatedFeatures });
  };

  const addCustomFeature = () => {
    if (customFeature.trim() !== "" && !formData.features.includes(customFeature)) {
      updateFormData({ features: [...formData.features, customFeature] });
      setCustomFeature("");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <Label>Property Features</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {commonPropertyFeatures.map((feature) => {
            const FeatureIcon = getFeatureIcon(feature.label);
            return (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={feature.id}
                  checked={formData.features.includes(feature.label)}
                  onCheckedChange={() => toggleFeature(feature.label)}
                />
                <div className="flex items-center space-x-2">
                  <FeatureIcon className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor={feature.id} className="cursor-pointer">
                    {feature.label}
                  </Label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customFeature">Add Custom Feature</Label>
        <div className="flex gap-2">
          <Input
            id="customFeature"
            value={customFeature}
            onChange={(e) => setCustomFeature(e.target.value)}
            placeholder="e.g. Rooftop Terrace"
          />
          <Button 
            type="button" 
            onClick={addCustomFeature}
            disabled={customFeature.trim() === ""}
          >
            Add
          </Button>
        </div>
      </div>

      {formData.features.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Features</Label>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => {
              const FeatureIcon = getFeatureIcon(feature);
              return (
                <div 
                  key={index} 
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  <FeatureIcon className="h-3 w-3 mr-1" />
                  {feature}
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium">Additional Property Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="heating">Heating System</Label>
            <Input
              id="heating"
              placeholder="e.g. Forced Air"
              value={formData.roomDetails?.heating || ""}
              onChange={(e) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  heating: e.target.value 
                } 
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="cooling">Cooling System</Label>
            <Input
              id="cooling"
              placeholder="e.g. Central Air"
              value={formData.roomDetails?.cooling || ""}
              onChange={(e) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  cooling: e.target.value 
                } 
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="construction">Construction Material</Label>
            <Select
              value={formData.roomDetails?.construction || ""}
              onValueChange={(value) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  construction: value 
                } 
              })}
            >
              <SelectTrigger id="construction">
                <SelectValue placeholder="Select construction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brick">Brick</SelectItem>
                <SelectItem value="Wood">Wood</SelectItem>
                <SelectItem value="Stucco">Stucco</SelectItem>
                <SelectItem value="Concrete">Concrete</SelectItem>
                <SelectItem value="Stone">Stone</SelectItem>
                <SelectItem value="Vinyl">Vinyl</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="heatingFuel">Heating Fuel</Label>
            <Select
              value={formData.roomDetails?.heatingFuel || ""}
              onValueChange={(value) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  heatingFuel: value 
                } 
              })}
            >
              <SelectTrigger id="heatingFuel">
                <SelectValue placeholder="Select heating fuel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Oil">Oil</SelectItem>
                <SelectItem value="Propane">Propane</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="centralVac"
              checked={formData.roomDetails?.centralVac || false}
              onCheckedChange={(checked) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  centralVac: !!checked 
                } 
              })}
            />
            <Label htmlFor="centralVac" className="cursor-pointer">
              Has Central Vacuum
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="fireplace"
              checked={formData.roomDetails?.fireplace || false}
              onCheckedChange={(checked) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  fireplace: !!checked 
                } 
              })}
            />
            <Label htmlFor="fireplace" className="cursor-pointer">
              Has Fireplace
            </Label>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesTab;
