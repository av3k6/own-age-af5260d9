
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
import { useProvinceLocation } from "@/hooks/use-province-location";
import { useToast } from "@/components/ui/use-toast";

interface ProvinceSelectorProps {
  className?: string;
}

const ProvinceSelector = ({ className = "" }: ProvinceSelectorProps) => {
  const [selectedProvince, setSelectedProvince] = useState<string>("ON");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check localStorage for a saved province
  useEffect(() => {
    try {
      const savedProvince = localStorage.getItem("selectedProvince");
      if (savedProvince) {
        setSelectedProvince(savedProvince);
      }
    } catch (error) {
      console.error("Error loading province from localStorage:", error);
    }
  }, []);

  // Use our hook to get the user's location
  useProvinceLocation({
    onLocationDetected: (province) => {
      if (province && province !== selectedProvince) {
        try {
          setSelectedProvince(province);
          localStorage.setItem("selectedProvince", province);
          
          // Show a toast to inform the user
          const provinceName = provinces.find(p => p.value === province)?.fullName || province;
          toast({
            title: "Location detected",
            description: `Showing properties in ${provinceName}`,
          });
        } catch (error) {
          console.error("Error setting province:", error);
        }
      }
    }
  });

  const handleProvinceChange = (value: string) => {
    try {
      setSelectedProvince(value);
      // Save to localStorage for persistence
      localStorage.setItem("selectedProvince", value);
      // If we're not on the homepage, navigate there to see filtered properties
      if (window.location.pathname !== '/') {
        navigate('/');
      }
    } catch (error) {
      console.error("Error changing province:", error);
    }
  };

  // Find the current province for displaying the full name as tooltip
  const currentProvince = provinces.find(p => p.value === selectedProvince);

  return (
    <Select value={selectedProvince} onValueChange={handleProvinceChange}>
      <SelectTrigger 
        className={`bg-background/50 dark:bg-background/30 border-primary/20 ${className}`}
        title={currentProvince?.fullName || "Select province"}
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary/70" />
          <SelectValue placeholder="Select province" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-background border-primary/20">
        <SelectGroup>
          {provinces.map((province) => (
            <SelectItem 
              key={province.value} 
              value={province.value}
              title={province.fullName}
            >
              {province.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ProvinceSelector;
