
import { getFeatureIcon } from "@/utils/featureIcons";

interface FeatureTagsProps {
  features: string[];
  onRemove: (feature: string) => void;
}

export const FeatureTags = ({ features, onRemove }: FeatureTagsProps) => {
  if (features.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature, index) => {
        const FeatureIcon = getFeatureIcon(feature);
        return (
          <div 
            key={index} 
            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
          >
            <FeatureIcon className="h-3 w-3 mr-1" />
            {feature}
            <button
              type="button"
              onClick={() => onRemove(feature)}
              className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
