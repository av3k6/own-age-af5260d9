
import { GarageIcon, Flame, Home, AirVent, Bath, Bed, WifiIcon, Tv, Waves, Shield, Cat, PalmtreeIcon, Warehouse, Building, Accessibility, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyFeaturesProps {
  features: string[];
}

// Map of feature names to their corresponding icons
const featureIconMap: Record<string, any> = {
  "Garage": GarageIcon,
  "Fireplace": Flame,
  "Basement": Home,
  "Air Conditioning": AirVent,
  "Swimming Pool": Waves,
  "Central Heating": Flame,
  "Bathroom": Bath,
  "Bedroom": Bed,
  "Wifi": WifiIcon,
  "Smart TV": Tv,
  "Security System": Shield,
  "Pet Friendly": Cat,
  "Garden": PalmtreeIcon,
  "Storage Space": Warehouse,
  "Elevator": Building,
  "Wheelchair Accessible": Accessibility,
  "Gym": HeartPulse,
  // Add more mappings as needed
};

// Helper function to get the icon for a feature
const getFeatureIcon = (feature: string) => {
  // Try to find an exact match first
  if (featureIconMap[feature]) {
    return featureIconMap[feature];
  }

  // If no exact match, try to find a partial match
  const key = Object.keys(featureIconMap).find(k => 
    feature.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(feature.toLowerCase())
  );
  
  return key ? featureIconMap[key] : Home; // Default to Home icon if no match found
};

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
