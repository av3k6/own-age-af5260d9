
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
    if (savedProvince && savedProvince !== "all") {
      setSelectedProvince(savedProvince);
      return;
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
              // Extract province/state code from response
              const stateCode = data.address?.state_code || "ON";
              
              // Check if the state code exists in our provinces list
              const provinceExists = provinces.some(p => p.value === stateCode);
              const newProvince = provinceExists ? stateCode : "ON";
              
              setSelectedProvince(newProvince);
              localStorage.setItem("selectedProvince", newProvince);
            }
          } catch (error) {
            console.error("Error getting location data:", error);
            // Default to Ontario if geocoding fails
            setSelectedProvince("ON");
            localStorage.setItem("selectedProvince", "ON");
          }
        },
        () => {
          // Default to Ontario if user denies location
          setSelectedProvince("ON");
          localStorage.setItem("selectedProvince", "ON");
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
