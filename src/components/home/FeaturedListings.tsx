
import { useEffect, useState } from "react";
import { PropertyListing } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { mockListings } from "@/data/mockData";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

// Canadian provinces with abbreviations
const provinces = [
  { value: "all", label: "All Provinces" },
  { value: "ON", label: "Ontario" },
  { value: "BC", label: "British Columbia" },
  { value: "AB", label: "Alberta" },
  { value: "QC", label: "Quebec" },
  { value: "MB", label: "Manitoba" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "YT", label: "Yukon" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
];

const FeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<PropertyListing[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);

  useEffect(() => {
    // Simulate data fetching
    // In a real app, you'd fetch from an API
    setFeaturedListings(mockListings.slice(0, 6));
  }, []);

  useEffect(() => {
    // Filter listings based on selected province
    if (selectedProvince === "all") {
      setFilteredListings(featuredListings);
    } else {
      const filtered = featuredListings.filter(
        listing => listing.address.state === selectedProvince
      );
      setFilteredListings(filtered);
    }
  }, [selectedProvince, featuredListings]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    // Save to localStorage for persistence
    localStorage.setItem("selectedProvince", value);
  };

  // Load saved province from localStorage on component mount
  useEffect(() => {
    const savedProvince = localStorage.getItem("selectedProvince");
    if (savedProvince) {
      setSelectedProvince(savedProvince);
    }
  }, []);

  return (
    <section className="py-12 bg-gray-50 dark:bg-background/95 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zen-gray-800 dark:text-white">Featured Properties</h2>
          <p className="mt-2 text-lg text-zen-gray-600 dark:text-gray-200">
            Discover our hand-picked selection of exceptional properties
          </p>
          
          {/* Province Filter Dropdown */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-xs">
              <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                <SelectTrigger className="w-full bg-white dark:bg-background dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="Select a province" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectGroup>
                    <SelectLabel className="text-zen-gray-600 dark:text-gray-300">Provinces</SelectLabel>
                    {provinces.map((province) => (
                      <SelectItem key={province.value} value={province.value}>
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <PropertyCard key={listing.id} property={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-lg text-zen-gray-600 dark:text-gray-300">
              No properties found in this province.
            </p>
            <p className="mt-2 text-zen-gray-500 dark:text-gray-400">
              Try selecting a different province or check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
