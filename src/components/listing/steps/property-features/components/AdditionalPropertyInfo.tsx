
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyRoomDetails } from "@/types";

interface AdditionalPropertyInfoProps {
  roomDetails: PropertyRoomDetails | undefined;
  updateRoomDetails: (details: Partial<PropertyRoomDetails>) => void;
}

export const AdditionalPropertyInfo = ({ roomDetails, updateRoomDetails }: AdditionalPropertyInfoProps) => {
  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="font-medium">Additional Property Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="heating">Heating System</Label>
          <Input
            id="heating"
            placeholder="e.g. Forced Air"
            value={roomDetails?.heating || ""}
            onChange={(e) => updateRoomDetails({ heating: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="cooling">Cooling System</Label>
          <Input
            id="cooling"
            placeholder="e.g. Central Air"
            value={roomDetails?.cooling || ""}
            onChange={(e) => updateRoomDetails({ cooling: e.target.value })}
          />
        </div>
        
        <div>
          <Label htmlFor="construction">Construction Material</Label>
          <Select
            value={roomDetails?.construction || ""}
            onValueChange={(value) => updateRoomDetails({ construction: value })}
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
            value={roomDetails?.heatingFuel || ""}
            onValueChange={(value) => updateRoomDetails({ heatingFuel: value })}
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
            checked={roomDetails?.centralVac || false}
            onCheckedChange={(checked) => updateRoomDetails({ centralVac: !!checked })}
          />
          <Label htmlFor="centralVac" className="cursor-pointer">
            Has Central Vacuum
          </Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="fireplace"
            checked={roomDetails?.fireplace || false}
            onCheckedChange={(checked) => updateRoomDetails({ fireplace: !!checked })}
          />
          <Label htmlFor="fireplace" className="cursor-pointer">
            Has Fireplace
          </Label>
        </div>
      </div>
    </div>
  );
};
