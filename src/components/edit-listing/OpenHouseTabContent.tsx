
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import OpenHouseTab from "@/components/edit-listing/open-house/OpenHouseTab";
import { OpenHouseProvider } from "@/contexts/OpenHouseContext";

interface OpenHouseTabContentProps {
  propertyId?: string;
  handleCancel: () => void;
  handleTabChange: (tab: string) => void;
}

const OpenHouseTabContent: React.FC<OpenHouseTabContentProps> = ({
  propertyId,
  handleCancel,
  handleTabChange
}) => {
  return (
    <TabsContent value="openHouse">
      <OpenHouseProvider propertyId={propertyId}>
        <OpenHouseTab propertyId={propertyId} />
        
        <div className="flex justify-end space-x-4 pt-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={() => handleTabChange("basic")}
          >
            Back to Basic Details
          </Button>
        </div>
      </OpenHouseProvider>
    </TabsContent>
  );
};

export default OpenHouseTabContent;
