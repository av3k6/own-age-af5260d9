
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";
import { ListingStatus } from "@/types";
import { useListingStatus } from "@/hooks/edit-listing/useListingStatus";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { PropertyDimensionsSection } from "./sections/PropertyDimensionsSection";
import { DescriptionSection } from "./sections/DescriptionSection";
import { AddressSection } from "./sections/AddressSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { StatusSection } from "./sections/StatusSection";

interface BasicDetailsTabProps {
  form: UseFormReturn<EditListingFormValues>;
}

const BasicDetailsTab: React.FC<BasicDetailsTabProps> = ({ form }) => {
  const currentStatus = form.watch("status");
  const { originalStatus, getOriginalStatus } = useListingStatus(undefined);
  
  useEffect(() => {
    getOriginalStatus();
  }, []);
  
  // Status is locked if it's EXPIRED
  const isStatusLocked = currentStatus === ListingStatus.EXPIRED;

  return (
    <div className="space-y-6">
      <BasicInfoSection form={form} />
      <PropertyDimensionsSection form={form} />
      <DescriptionSection form={form} />
      <AddressSection form={form} />
      <FeaturesSection form={form} />
      <StatusSection form={form} isStatusLocked={isStatusLocked} />
    </div>
  );
};

export default BasicDetailsTab;
