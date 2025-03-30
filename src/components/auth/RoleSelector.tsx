
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/types";
import { Control } from "react-hook-form";

interface RoleSelectorProps {
  control: Control<any>;
}

const RoleSelector = ({ control }: RoleSelectorProps) => {
  return (
    <FormItem>
      <FormLabel>I am a:</FormLabel>
      <FormControl>
        <RadioGroup
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value={UserRole.BUYER} id="buyer" />
            <Label htmlFor="buyer" className="cursor-pointer">Buyer</Label>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value={UserRole.SELLER} id="seller" />
            <Label htmlFor="seller" className="cursor-pointer">Seller</Label>
          </div>
          <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md px-4 py-2 flex-1 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value={UserRole.PROFESSIONAL} id="professional" />
            <Label htmlFor="professional" className="cursor-pointer">Professional</Label>
          </div>
        </RadioGroup>
      </FormControl>
    </FormItem>
  );
};

export default RoleSelector;
