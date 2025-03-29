
import { useState } from "react";
import { ListingFormData } from "../ListingForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bed, Bath, AreaChart, Calendar } from "lucide-react";

interface PropertyFeaturesProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const commonFeatures = [
  { id: "garage", label: "Garage" },
  { id: "basement", label: "Basement" },
  { id: "pool", label: "Swimming Pool" },
  { id: "fireplace", label: "Fireplace" },
  { id: "garden", label: "Garden" },
  { id: "airConditioning", label: "Air Conditioning" },
  { id: "heating", label: "Central Heating" },
  { id: "balcony", label: "Balcony" },
  { id: "securitySystem", label: "Security System" },
  { id: "parkingSpot", label: "Parking Spot" },
  { id: "furnished", label: "Furnished" },
  { id: "petFriendly", label: "Pet Friendly" },
  { id: "storageSpace", label: "Storage Space" },
  { id: "elevator", label: "Elevator" },
  { id: "wheelchair", label: "Wheelchair Accessible" }
];

const PropertyFeatures = ({ 
  formData, 
  updateFormData, 
  onNext, 
  onBack 
}: PropertyFeaturesProps) => {
  const [customFeature, setCustomFeature] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

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

  const isFormValid = () => {
    return (
      formData.bedrooms > 0 &&
      formData.bathrooms > 0 &&
      formData.squareFeet > 0 &&
      formData.yearBuilt > 0
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="bedrooms" className="flex items-center gap-2">
              <Bed className="h-4 w-4" /> Bedrooms
            </Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) => updateFormData({ bedrooms: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="bathrooms" className="flex items-center gap-2">
              <Bath className="h-4 w-4" /> Bathrooms
            </Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) => updateFormData({ bathrooms: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="squareFeet" className="flex items-center gap-2">
              <AreaChart className="h-4 w-4" /> Square Feet
            </Label>
            <Input
              id="squareFeet"
              type="number"
              min="0"
              value={formData.squareFeet || ""}
              onChange={(e) => updateFormData({ squareFeet: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="yearBuilt" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Year Built
            </Label>
            <Input
              id="yearBuilt"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.yearBuilt || ""}
              onChange={(e) => updateFormData({ yearBuilt: Number(e.target.value) })}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Property Features</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {commonFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox 
                id={feature.id}
                checked={formData.features.includes(feature.label)}
                onCheckedChange={() => toggleFeature(feature.label)}
              />
              <Label htmlFor={feature.id} className="cursor-pointer">
                {feature.label}
              </Label>
            </div>
          ))}
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
            {formData.features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={!isFormValid()}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default PropertyFeatures;
