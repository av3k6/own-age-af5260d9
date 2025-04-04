
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { EditListingFormValues } from "@/types/edit-listing";
import { StatusSelector } from "../StatusSelector";
import { ListingStatus } from "@/types";

interface StatusSectionProps {
  form: UseFormReturn<EditListingFormValues>;
  isStatusLocked: boolean;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ form, isStatusLocked }) => {
  return (
    <>
      <div>
        <h2 className="text-lg font-semibold mb-2">Listing Status</h2>
      </div>
      
      <StatusSelector form={form} isStatusLocked={isStatusLocked} />
    </>
  );
};
