
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
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const navigate = useNavigate();

  // Load saved province from localStorage on component mount
  useEffect(() => {
    const savedProvince = localStorage.getItem("selectedProvince");
    if (savedProvince) {
      setSelectedProvince(savedProvince);
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
          {provinces.map((province) => (
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
