
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useFormContext } from "../../context/FormContext";
import BasicInformation from "./BasicInformation";
import PropertyDetailsSection from "./PropertyDetailsSection";
import OptionalDetailsSection from "./OptionalDetailsSection";
import FeaturesSection from "./FeaturesSection";
import DescriptionSection from "./DescriptionSection";
import MediaSection from "./MediaSection";
import DocumentsSection from "./DocumentsSection";
import ListingStatusSection from "./ListingStatusSection";
import ConfirmationSection from "./ConfirmationSection";

interface ReviewAndPublishProps {
  onPublish: () => Promise<void>;
}

const ReviewAndPublish = ({ onPublish }: ReviewAndPublishProps) => {
  const { goToPreviousStep, isSubmitting, formData } = useFormContext();

  const handlePublish = async () => {
    await onPublish();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <BasicInformation />
        <PropertyDetailsSection />
        
        {/* Optional Details Section (conditionally rendered) */}
        {(formData.propertyCondition || formData.recentUpgrades || formData.utilityInformation || 
          formData.fees || formData.energyEfficient !== undefined || formData.parkingDetails || 
          formData.specialAmenities) && (
          <OptionalDetailsSection />
        )}

        <FeaturesSection />
        <DescriptionSection />
        <MediaSection />
        
        {formData.documents.length > 0 && (
          <DocumentsSection />
        )}
      </div>

      <ListingStatusSection />
      <ConfirmationSection />

      <div className="flex justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={goToPreviousStep} disabled={isSubmitting}>
          Back
        </Button>
        <Button 
          onClick={handlePublish}
          disabled={isSubmitting || !formData.confirmationChecked}
          className="gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              Publish Listing
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndPublish;
