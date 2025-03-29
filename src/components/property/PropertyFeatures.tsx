
import { icons } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFeatureIcon } from "@/utils/featureIcons";

interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Property Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const FeatureIcon = getFeatureIcon(feature);
          return (
            <div key={index} className="flex items-center">
              <div className="bg-zen-blue-100 text-zen-blue-500 p-2 rounded-full mr-3">
                <FeatureIcon className="h-4 w-4" />
              </div>
              <span className="text-zen-gray-700">{feature}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
