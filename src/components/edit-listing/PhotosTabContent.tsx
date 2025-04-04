
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PhotoManagementTab from "@/components/edit-listing/photo-management/PhotoManagementTab";

interface PhotosTabContentProps {
  propertyId?: string;
  handleCancel: () => void;
  handleTabChange: (tab: string) => void;
}

const PhotosTabContent: React.FC<PhotosTabContentProps> = ({
  propertyId,
  handleCancel,
  handleTabChange
}) => {
  return (
    <TabsContent value="photos">
      <PhotoManagementTab propertyId={propertyId} />
      
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
    </TabsContent>
  );
};

export default PhotosTabContent;
