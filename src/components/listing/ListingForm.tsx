
import React from "react";
import { FormProvider } from "./context/FormContext";
import ListingFormContent from "./components/ListingFormContent";

const ListingForm = () => {
  return (
    <FormProvider>
      <ListingFormContent />
    </FormProvider>
  );
};

export default ListingForm;
