
import { ListingStatus, PropertyType } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Check, Loader2, Info, AlertTriangle } from "lucide-react";
import { useFormContext, PropertyCondition } from "../context/FormContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ReviewAndPublishProps {
  onPublish: () => Promise<void>;
}

const ReviewAndPublish = ({ onPublish }: ReviewAndPublishProps) => {
  const { formData, updateFormData, goToPreviousStep, isSubmitting } = useFormContext();
  const [isOptionalDetailsOpen, setIsOptionalDetailsOpen] = useState(false);
  
  const handleStatusChange = (status: ListingStatus) => {
    updateFormData({ status });
  };

  const handleConfirmationChange = (checked: boolean) => {
    updateFormData({ confirmationChecked: checked });
  };

  const handlePublish = async () => {
    await onPublish();
  };

  const getPropertyConditionLabel = (condition: PropertyCondition | undefined) => {
    if (!condition) return "Not specified";
    
    const labels: Record<PropertyCondition, string> = {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      needs_renovation: "Needs Renovation"
    };
    
    return labels[condition];
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Property Title</p>
              <p className="font-medium">{formData.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Property Type</p>
              <p className="font-medium">{formData.propertyType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Asking Price</p>
              <p className="font-medium">{formatCurrency(formData.price)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">
                {formData.address.street}, {formData.address.city}, {formData.address.state} {formData.address.zipCode}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Property Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-md">
            <div>
              <p className="text-sm text-muted-foreground">Bedrooms</p>
              <p className="font-medium">{formData.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bathrooms</p>
              <p className="font-medium">{formData.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Square Feet</p>
              <p className="font-medium">{formData.squareFeet.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Built</p>
              <p className="font-medium">{formData.yearBuilt}</p>
            </div>
          </div>
        </div>

        {/* Additional Property Details (Optional) */}
        {(formData.propertyCondition || formData.recentUpgrades || formData.utilityInformation || 
          formData.fees || formData.energyEfficient || formData.parkingDetails || 
          formData.specialAmenities) && (
          <div className="space-y-2">
            <Collapsible 
              open={isOptionalDetailsOpen} 
              onOpenChange={setIsOptionalDetailsOpen}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="flex justify-between items-center w-full p-4">
                <h3 className="text-lg font-medium">Additional Property Details</h3>
                <Button variant="ghost" size="icon">
                  {isOptionalDetailsOpen ? (
                    <Info className="h-4 w-4" />
                  ) : (
                    <Info className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 pt-0 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.propertyCondition && (
                    <div>
                      <p className="text-sm text-muted-foreground">Property Condition</p>
                      <p className="font-medium">{getPropertyConditionLabel(formData.propertyCondition)}</p>
                    </div>
                  )}
                  
                  {formData.recentUpgrades && (
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Upgrades</p>
                      <p className="font-medium">{formData.recentUpgrades}</p>
                    </div>
                  )}
                  
                  {formData.utilityInformation && (
                    <div>
                      <p className="text-sm text-muted-foreground">Utility Information</p>
                      <p className="font-medium">{formData.utilityInformation}</p>
                    </div>
                  )}
                  
                  {formData.fees && (
                    <div>
                      <p className="text-sm text-muted-foreground">HOA/Condo Fees or Property Taxes</p>
                      <p className="font-medium">{formData.fees}</p>
                    </div>
                  )}
                  
                  {formData.energyEfficient !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Energy Efficient</p>
                      <p className="font-medium">{formData.energyEfficient ? "Yes" : "No"}</p>
                    </div>
                  )}
                  
                  {formData.parkingDetails && (
                    <div>
                      <p className="text-sm text-muted-foreground">Parking Details</p>
                      <p className="font-medium">{formData.parkingDetails}</p>
                    </div>
                  )}
                  
                  {formData.specialAmenities && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Special Amenities or Notes</p>
                      <p className="font-medium">{formData.specialAmenities}</p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Features</h3>
          <div className="p-4 bg-muted/50 rounded-md">
            {formData.features.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="px-3 py-1 bg-background rounded-full text-sm">
                    {feature}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No features selected</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Description</h3>
          <div className="p-4 bg-muted/50 rounded-md">
            <p>{formData.description}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs py-1 text-center">
                    Primary Photo
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {formData.documents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Documents</h3>
            <div className="p-4 bg-muted/50 rounded-md">
              <div className="flex flex-wrap gap-3">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-background rounded-md">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[150px]">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Listing Status</h3>
        <RadioGroup 
          defaultValue={formData.status}
          onValueChange={(value) => handleStatusChange(value as ListingStatus)}
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={ListingStatus.ACTIVE} id="active" />
            <Label htmlFor="active" className="cursor-pointer">
              <span className="font-medium">Active</span> - Immediately visible to all users
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={ListingStatus.PENDING} id="pending" />
            <Label htmlFor="pending" className="cursor-pointer">
              <span className="font-medium">Pending</span> - Hidden until you activate it
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="confirmation" 
            checked={formData.confirmationChecked}
            onCheckedChange={handleConfirmationChange}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label 
              htmlFor="confirmation" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I confirm that the information provided is true to the best of my knowledge and is not misleading.
            </Label>
            <p className="text-sm text-muted-foreground">
              By checking this box, you confirm that all information is accurate and complete.
            </p>
          </div>
        </div>
        
        {!formData.confirmationChecked && (
          <div className="text-sm text-amber-600 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span>You must confirm that the information is accurate before publishing</span>
          </div>
        )}
      </div>

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
