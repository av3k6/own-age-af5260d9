
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { provinces } from "@/utils/provinceData";

interface ProvinceSelectorProps {
  className?: string;
}

const ProvinceSelector = ({ className = "" }: ProvinceSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string>("ON");
  const navigate = useNavigate();

  // Try to get user's location on component mount
  useEffect(() => {
    // First check if we have a saved province
    const savedProvince = localStorage.getItem("selectedProvince");
    if (savedProvince) {
      setSelectedProvince(savedProvince);
    }
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Call a geocoding service to get province from coordinates
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            
            if (response.ok) {
              const data = await response.json();
              console.log("Geocoding response:", data); // Debug log
              
              // Extract province/state from response
              const stateCode = data.address?.state_code;
              const state = data.address?.state;
              
              // Try to match the province code or name
              let detectedProvince = "ON"; // Default
              
              if (stateCode) {
                // Check if the state code exists in our provinces list
                const provinceMatch = provinces.find(p => p.value === stateCode);
                if (provinceMatch) {
                  detectedProvince = stateCode;
                }
              } else if (state) {
                // Try to match by full province name
                const provinceMatch = provinces.find(p => 
                  state.toLowerCase().includes(p.label.toLowerCase()) || 
                  p.label.toLowerCase().includes(state.toLowerCase())
                );
                if (provinceMatch) {
                  detectedProvince = provinceMatch.value;
                }
              }
              
              console.log("Detected province:", detectedProvince); // Debug log
              
              // Only update if it's different from current selection
              if (detectedProvince !== selectedProvince) {
                setSelectedProvince(detectedProvince);
                localStorage.setItem("selectedProvince", detectedProvince);
              }
            }
          } catch (error) {
            console.error("Error getting location data:", error);
            // Default to Ontario if geocoding fails
            if (!savedProvince) {
              setSelectedProvince("ON");
              localStorage.setItem("selectedProvince", "ON");
            }
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default to Ontario if user denies location
          if (!savedProvince) {
            setSelectedProvince("ON");
            localStorage.setItem("selectedProvince", "ON");
          }
        }
      );
    }
  }, []);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    // Save to localStorage for persistence
    localStorage.setItem("selectedProvince", value);
    // If we're not on the homepage, navigate there to see filtered properties
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
      <SelectTrigger className={`bg-background/50 dark:bg-background/30 border-primary/20 ${className}`}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary/70" />
          <SelectValue placeholder="Select province" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-background border-primary/20">
        <SelectGroup>
          {provinces.filter(province => province.value !== "all").map((province) => (
            <SelectItem key={province.value} value={province.value}>
              {province.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProvinceSelector;
