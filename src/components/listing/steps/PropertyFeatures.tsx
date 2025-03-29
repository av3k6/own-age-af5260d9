
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "../context/FormContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicPropertyDetails from "./property-features/tabs/BasicPropertyDetails";
import FeaturesTab from "./property-features/tabs/FeaturesTab";
import RoomDetailsTab from "./property-features/tabs/RoomDetailsTab";

const PropertyFeatures = () => {
  const { goToNextStep, goToPreviousStep } = useFormContext();
  const [activeTab, setActiveTab] = React.useState("basic");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="rooms">Room Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6">
          <BasicPropertyDetails />
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <FeaturesTab />
        </TabsContent>
        
        <TabsContent value="rooms" className="space-y-6">
          <RoomDetailsTab />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button type="submit">
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default PropertyFeatures;
