
import * as React from "react";
import { Input } from "@/components/ui/input";

interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
}

export function TimeInput({ value, onChange, className, ...props }: TimeInputProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Input
      type="time"
      value={value}
      onChange={handleTimeChange}
      className={className}
      {...props}
    />
  );
}
