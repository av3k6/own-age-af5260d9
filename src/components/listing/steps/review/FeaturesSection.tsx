
import { useFormContext } from "../../context/FormContext";

const FeaturesSection = () => {
  const { formData } = useFormContext();

  return (
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
  );
};

export default FeaturesSection;
