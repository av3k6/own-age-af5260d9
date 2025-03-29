
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ListingStatus, PropertyType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { provinces } from "@/utils/provinceData";
import BasicDetails from "./steps/BasicDetails";
import PropertyFeatures from "./steps/PropertyFeatures";
import MediaUpload from "./steps/MediaUpload";
import DocumentUpload from "./steps/DocumentUpload";
import ReviewAndPublish from "./steps/ReviewAndPublish";

type FormSteps = "basic" | "features" | "media" | "documents" | "review";

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

const ListingForm = () => {
  const [currentStep, setCurrentStep] = useState<FormSteps>("basic");
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handlePublish = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to publish a property",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Upload images to storage
      const imagePromises = formData.images.map(async (image, index) => {
        const fileName = `${user.id}-${Date.now()}-${index}`;
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(`public/${fileName}`, image);

        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(`public/${fileName}`);
        
        return urlData.publicUrl;
      });

      const imageUrls = await Promise.all(imagePromises);

      // 2. Upload documents to storage
      const documentPromises = formData.documents.map(async (doc, index) => {
        const fileName = `${user.id}-${Date.now()}-${index}-${doc.name}`;
        const { data, error } = await supabase.storage
          .from('property-documents')
          .upload(`${user.id}/${fileName}`, doc);

        if (error) throw error;
        
        return {
          name: doc.name,
          type: doc.type,
          size: doc.size,
          url: fileName
        };
      });

      const documentData = await Promise.all(documentPromises);

      // 3. Insert the listing in the database
      const { data, error } = await supabase
        .from('property_listings')
        .insert({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          address: formData.address,
          property_type: formData.propertyType,
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          square_feet: formData.squareFeet,
          year_built: formData.yearBuilt,
          features: formData.features,
          images: imageUrls,
          documents: documentData,
          seller_id: user.id,
          status: formData.status,
          created_at: new Date(),
          updated_at: new Date()
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your property listing has been published",
      });

      // Redirect to the new listing or dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error publishing listing:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish your listing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">
            {currentStep === "basic" && "Basic Details"}
            {currentStep === "features" && "Property Features"}
            {currentStep === "media" && "Upload Photos"}
            {currentStep === "documents" && "Upload Documents"}
            {currentStep === "review" && "Review & Publish"}
          </h2>
          <div className="text-sm text-muted-foreground">
            Step {currentStep === "basic" ? 1 : 
                  currentStep === "features" ? 2 :
                  currentStep === "media" ? 3 :
                  currentStep === "documents" ? 4 : 5} of 5
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ 
              width: currentStep === "basic" ? "20%" : 
                     currentStep === "features" ? "40%" :
                     currentStep === "media" ? "60%" :
                     currentStep === "documents" ? "80%" : "100%" 
            }}
          ></div>
        </div>
      </div>
      
      <div className="p-6">
        {currentStep === "basic" && (
          <BasicDetails 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep} 
          />
        )}
        
        {currentStep === "features" && (
          <PropertyFeatures 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep} 
            onBack={goToPreviousStep} 
          />
        )}
        
        {currentStep === "media" && (
          <MediaUpload 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep} 
            onBack={goToPreviousStep} 
          />
        )}
        
        {currentStep === "documents" && (
          <DocumentUpload 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={goToNextStep} 
            onBack={goToPreviousStep} 
          />
        )}
        
        {currentStep === "review" && (
          <ReviewAndPublish 
            formData={formData} 
            updateFormData={updateFormData} 
            onBack={goToPreviousStep}
            onPublish={handlePublish}
          />
        )}
      </div>
    </div>
  );
};

export default ListingForm;
