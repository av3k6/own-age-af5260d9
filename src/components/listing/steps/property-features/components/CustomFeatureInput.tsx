
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CustomFeatureInputProps {
  onAddFeature: (feature: string) => void;
}

export const CustomFeatureInput = ({ onAddFeature }: CustomFeatureInputProps) => {
  const [customFeature, setCustomFeature] = useState("");

  const handleAddFeature = () => {
    if (customFeature.trim() !== "") {
      onAddFeature(customFeature);
      setCustomFeature("");
    }
  };

  return (
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
          onClick={handleAddFeature}
          disabled={customFeature.trim() === ""}
        >
          Add
        </Button>
      </div>
    </div>
  );
};
