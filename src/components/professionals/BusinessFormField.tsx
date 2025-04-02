
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BusinessFormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "input" | "textarea";
  placeholder?: string;
  icon?: React.ReactNode;
}

const BusinessFormField: React.FC<BusinessFormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = "input",
  placeholder,
  icon
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={icon ? "flex items-center gap-1" : ""}>
        {icon && icon} {label}
      </Label>
      
      {type === "input" ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
        />
      )}
    </div>
  );
};

export default BusinessFormField;
