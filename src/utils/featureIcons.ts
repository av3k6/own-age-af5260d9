
import { icons } from "lucide-react";

// Create a mapping of feature names to icon names from lucide-react
export const featureIconMap: Record<string, keyof typeof icons> = {
  "Garage": "Warehouse",
  "Fireplace": "Flame",
  "Basement": "Home",
  "Air Conditioning": "AirVent",
  "Swimming Pool": "Waves", 
  "Central Heating": "Flame",
  "Bathroom": "Bath",
  "Bedroom": "Bed",
  "Wifi": "Wifi",
  "Smart TV": "Tv",
  "Security System": "Shield",
  "Pet Friendly": "Cat",
  "Garden": "PalmtreeIcon",
  "Storage Space": "Warehouse",
  "Elevator": "Building",
  "Wheelchair Accessible": "Accessibility",
  "Gym": "Activity",
  // Add more mappings as needed
};

// Helper function to get the icon for a feature
export const getFeatureIcon = (feature: string) => {
  // Try to find an exact match first
  if (featureIconMap[feature]) {
    return icons[featureIconMap[feature]];
  }

  // If no exact match, try to find a partial match
  const key = Object.keys(featureIconMap).find(k => 
    feature.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(feature.toLowerCase())
  );
  
  return key ? icons[featureIconMap[key]] : icons.Home; // Default to Home icon if no match found
};
