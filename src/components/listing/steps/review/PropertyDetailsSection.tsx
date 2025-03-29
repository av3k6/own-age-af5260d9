
import { useFormContext } from "../../context/FormContext";

const PropertyDetailsSection = () => {
  const { formData } = useFormContext();

  return (
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
  );
};

export default PropertyDetailsSection;
