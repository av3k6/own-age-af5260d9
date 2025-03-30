
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Control, Controller } from "react-hook-form";

interface TermsCheckboxProps {
  control: Control<any>;
}

const TermsCheckbox = ({ control }: TermsCheckboxProps) => {
  return (
    <FormItem>
      <Controller
        control={control}
        name="terms"
        render={({ field }) => (
          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4 text-zen-blue-600 focus:ring-zen-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="terms" className="ml-2 block text-sm text-zen-gray-900">
              I agree to the{" "}
              <Link to="/terms" className="font-medium text-zen-blue-600 hover:text-zen-blue-500">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium text-zen-blue-600 hover:text-zen-blue-500">
                Privacy Policy
              </Link>
            </Label>
          </div>
        )}
      />
    </FormItem>
  );
};

export default TermsCheckbox;
