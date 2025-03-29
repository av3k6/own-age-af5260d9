
import { useFormContext } from "../../context/FormContext";
import { GarageIcon, Flame, Home, AirVent, Bath, Bed, WifiIcon, Tv, Waves, Shield, Cat, PalmtreeIcon, Warehouse, Building, Accessibility, HeartPulse } from "lucide-react";

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

const FeaturesSection = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Features</h3>
      <div className="p-4 bg-muted/50 rounded-md">
        {formData.features.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => {
              const FeatureIcon = getFeatureIcon(feature);
              return (
                <div key={index} className="px-3 py-1 bg-background rounded-full text-sm flex items-center">
                  <FeatureIcon className="h-3 w-3 mr-2" />
                  {feature}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground italic">No features selected</p>
        )}
      </div>
      
      {formData.roomDetails && (formData.roomDetails.bedrooms?.length || formData.roomDetails.otherRooms?.length) ? (
        <div className="mt-4">
          <h4 className="text-md font-medium">Room Details</h4>
          
          {formData.roomDetails.bedrooms?.length ? (
            <div className="mt-2">
              <h5 className="text-sm font-medium text-muted-foreground">Bedrooms</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {formData.roomDetails.bedrooms.map((room, index) => (
                  <div key={index} className="p-2 bg-background rounded-md">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level: {room.level}
                      {room.dimensions && `, Dimensions: ${room.dimensions}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          
          {formData.roomDetails.otherRooms?.length ? (
            <div className="mt-2">
              <h5 className="text-sm font-medium text-muted-foreground">Other Rooms</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {formData.roomDetails.otherRooms.map((room, index) => (
                  <div key={index} className="p-2 bg-background rounded-md">
                    <p className="font-medium">{room.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Level: {room.level}
                      {room.dimensions && `, Dimensions: ${room.dimensions}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default FeaturesSection;
