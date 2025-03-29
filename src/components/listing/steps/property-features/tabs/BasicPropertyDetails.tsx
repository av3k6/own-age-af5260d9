
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bed, Bath, AreaChart, Calendar, TreePine, Warehouse, Building2, Home } from "lucide-react";
import { useFormContext } from "../../../context/FormContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BasicPropertyDetails = () => {
  const { formData, updateFormData } = useFormContext();
  
  const isFormValid = () => {
    return (
      formData.bedrooms > 0 &&
      formData.bathrooms > 0 &&
      formData.squareFeet > 0 &&
      formData.yearBuilt > 0
    );
  };
  
  return (
    <>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="lotSize" className="flex items-center gap-2">
              <TreePine className="h-4 w-4" /> Lot Size
            </Label>
            <Input
              id="lotSize"
              placeholder="e.g. 70 x 180 feet"
              value={formData.roomDetails?.lotSize || ""}
              onChange={(e) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  lotSize: e.target.value 
                } 
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="parkingSpaces" className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" /> Parking Spaces
            </Label>
            <Input
              id="parkingSpaces"
              type="number"
              min="0"
              value={formData.roomDetails?.totalParkingSpaces || ""}
              onChange={(e) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  totalParkingSpaces: Number(e.target.value) 
                } 
              })}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="stories" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Stories/Levels
            </Label>
            <Input
              id="stories"
              type="number"
              min="1"
              value={formData.roomDetails?.stories || ""}
              onChange={(e) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  stories: Number(e.target.value) 
                } 
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="basement" className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Basement Type
            </Label>
            <Select
              value={formData.roomDetails?.basement || ""}
              onValueChange={(value) => updateFormData({ 
                roomDetails: { 
                  ...formData.roomDetails, 
                  basement: value 
                } 
              })}
            >
              <SelectTrigger id="basement">
                <SelectValue placeholder="Select basement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Finished">Finished</SelectItem>
                <SelectItem value="Unfinished">Unfinished</SelectItem>
                <SelectItem value="Partially Finished">Partially Finished</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicPropertyDetails;
