
import React from "react";
import { DocumentMetadata } from "@/types/document";
import FloorPlanItem from "./FloorPlanItem";
import { Label } from "@/components/ui/label";

interface FloorPlanListProps {
  floorPlans: DocumentMetadata[];
  onDelete: (floorPlan: DocumentMetadata) => void;
  onDownload: (floorPlan: DocumentMetadata) => void;
}

const FloorPlanList = ({ floorPlans, onDelete, onDownload }: FloorPlanListProps) => {
  if (floorPlans.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground text-center mt-4">
        No floor plans uploaded yet
      </p>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <Label>Uploaded Floor Plans</Label>
      <div className="space-y-2">
        {floorPlans.map((floorPlan) => (
          <FloorPlanItem
            key={floorPlan.id}
            floorPlan={floorPlan}
            onDelete={onDelete}
            onDownload={onDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default FloorPlanList;
