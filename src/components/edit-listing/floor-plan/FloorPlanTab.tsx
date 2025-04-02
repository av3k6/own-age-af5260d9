
import React from "react";
import { DocumentMetadata } from "@/types/document";
import FloorPlanUploader from "./FloorPlanUploader";
import FloorPlanList from "./FloorPlanList";
import { useFloorPlanActions } from "./useFloorPlanActions";

interface FloorPlanTabProps {
  floorPlans: DocumentMetadata[];
  setFloorPlans: (floorPlans: DocumentMetadata[]) => void;
  propertyId?: string;
}

const FloorPlanTab = ({ floorPlans, setFloorPlans, propertyId }: FloorPlanTabProps) => {
  const { handleDelete, handleDownload } = useFloorPlanActions(floorPlans, setFloorPlans);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Property Floor Plans</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload floor plans in PDF, JPG, PNG, DWG, or DXF format. Buyers will be able to download these documents.
        </p>

        <div className="space-y-4">
          <FloorPlanUploader 
            floorPlans={floorPlans}
            setFloorPlans={setFloorPlans}
            propertyId={propertyId}
          />
          
          <FloorPlanList 
            floorPlans={floorPlans}
            onDelete={handleDelete}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default FloorPlanTab;
