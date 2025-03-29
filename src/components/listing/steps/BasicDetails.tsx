
import { PropertyType } from "@/types";
import { ListingFormData } from "../ListingForm";
import { provinces } from "@/utils/provinceData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Home, Building2, Building, TreePine, Warehouse } from "lucide-react";

interface BasicDetailsProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onNext: () => void;
}

const propertyTypes = [
  { value: PropertyType.HOUSE, label: "House", icon: Home },
  { value: PropertyType.APARTMENT, label: "Apartment", icon: Building },
  { value: PropertyType.CONDO, label: "Condo", icon: Building2 },
  { value: PropertyType.TOWNHOUSE, label: "Townhouse", icon: Building2 },
  { value: PropertyType.LAND, label: "Land", icon: TreePine },
  { value: PropertyType.COMMERCIAL, label: "Commercial", icon: Warehouse },
  { value: PropertyType.OTHER, label: "Other", icon: Building },
];

const BasicDetails = ({ formData, updateFormData, onNext }: BasicDetailsProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.price > 0 &&
      formData.description.trim() !== "" &&
      formData.address.street.trim() !== "" &&
      formData.address.city.trim() !== "" &&
      formData.address.zipCode.trim() !== ""
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Property Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="e.g. Modern Downtown Condo"
            required
          />
        </div>

        <div>
          <Label>Property Type</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  type="button"
                  variant={formData.propertyType === type.value ? "default" : "outline"}
                  className="flex flex-col items-center justify-center h-24 gap-2"
                  onClick={() => updateFormData({ propertyType: type.value })}
                >
                  <Icon className="h-6 w-6" />
                  <span>{type.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="price">Asking Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="1000"
            value={formData.price || ""}
            onChange={(e) => updateFormData({ price: Number(e.target.value) })}
            placeholder="e.g. 450000"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) => updateFormData({ 
                address: { ...formData.address, street: e.target.value } 
              })}
              placeholder="123 Main St"
              required
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => updateFormData({ 
                address: { ...formData.address, city: e.target.value } 
              })}
              placeholder="e.g. Toronto"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="province">Province</Label>
            <Select
              value={formData.address.state}
              onValueChange={(value) => updateFormData({ 
                address: { ...formData.address, state: value } 
              })}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {provinces.slice(1).map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="zipCode">Postal Code</Label>
            <Input
              id="zipCode"
              value={formData.address.zipCode}
              onChange={(e) => updateFormData({ 
                address: { ...formData.address, zipCode: e.target.value } 
              })}
              placeholder="e.g. M5V 2H1"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Property Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe your property..."
            className="h-32"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid()}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default BasicDetails;
