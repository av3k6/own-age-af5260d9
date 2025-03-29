
import React, { createContext, useState, useContext } from "react";
import { ListingStatus, PropertyType } from "@/types";
import { provinces } from "@/utils/provinceData";

export type FormSteps = "basic" | "features" | "media" | "documents" | "review";

export interface ListingFormData {
  title: string;
  propertyType: PropertyType;
  price: number;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  features: string[];
  images: File[];
  imageUrls: string[];
  documents: File[];
  documentNames: string[];
  status: ListingStatus;
}

const initialFormData: ListingFormData = {
  title: "",
  propertyType: PropertyType.HOUSE,
  price: 0,
  description: "",
  address: {
    street: "",
    city: "",
    state: provinces[1].value, // Default to Ontario
    zipCode: "",
  },
  bedrooms: 1,
  bathrooms: 1,
  squareFeet: 0,
  yearBuilt: new Date().getFullYear(),
  features: [],
  images: [],
  imageUrls: [],
  documents: [],
  documentNames: [],
  status: ListingStatus.PENDING,
};

interface FormContextType {
  currentStep: FormSteps;
  setCurrentStep: React.Dispatch<React.SetStateAction<FormSteps>>;
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<FormSteps>("basic");
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    switch (currentStep) {
      case "basic":
        setCurrentStep("features");
        break;
      case "features":
        setCurrentStep("media");
        break;
      case "media":
        setCurrentStep("documents");
        break;
      case "documents":
        setCurrentStep("review");
        break;
      default:
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "features":
        setCurrentStep("basic");
        break;
      case "media":
        setCurrentStep("features");
        break;
      case "documents":
        setCurrentStep("media");
        break;
      case "review":
        setCurrentStep("documents");
        break;
      default:
        break;
    }
  };

  return (
    <FormContext.Provider 
      value={{ 
        currentStep, 
        setCurrentStep, 
        formData, 
        updateFormData, 
        isSubmitting, 
        setIsSubmitting,
        goToNextStep,
        goToPreviousStep
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
