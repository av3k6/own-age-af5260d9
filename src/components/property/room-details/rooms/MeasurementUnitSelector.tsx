
import React from "react";

interface MeasurementUnitSelectorProps {
  measurementUnit: string;
  setMeasurementUnit: (unit: string) => void;
}

const MeasurementUnitSelector = ({ 
  measurementUnit, 
  setMeasurementUnit 
}: MeasurementUnitSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Measurement Unit:</span>
      <select 
        value={measurementUnit}
        onChange={(e) => setMeasurementUnit(e.target.value)}
        className="px-3 py-1 border rounded-md text-sm text-foreground bg-background"
      >
        <option value="Feet">Feet</option>
        <option value="Meters">Meters</option>
      </select>
    </div>
  );
};

export default MeasurementUnitSelector;
