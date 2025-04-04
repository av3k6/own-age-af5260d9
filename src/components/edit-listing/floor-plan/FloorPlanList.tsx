
import React from "react";
import { DocumentMetadata } from "@/types/document";
import FloorPlanItem from "./FloorPlanItem";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FloorPlanListProps {
  floorPlans: DocumentMetadata[];
  onDelete: (floorPlan: DocumentMetadata) => void;
  onDownload: (floorPlan: DocumentMetadata) => void;
}

const FloorPlanList = ({ floorPlans, onDelete, onDownload }: FloorPlanListProps) => {
  if (floorPlans.length === 0) {
    return (
      <div className="mt-6">
        <p className="text-sm italic text-muted-foreground text-center">
          No floor plans uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <Label className="text-base">Uploaded Floor Plans ({floorPlans.length})</Label>
      </div>
      
      <Alert className="bg-muted/50 border-muted">
        <AlertDescription className="text-sm">
          Floor plans will be publicly available to potential buyers after you save the listing.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2 mt-2">
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
