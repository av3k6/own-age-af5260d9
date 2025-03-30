
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PropertyType } from "@/types";
import { Check } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface FilterPanelProps {
  searchParams: {
    location: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: PropertyType[];
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    location: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: number;
    bathrooms: number;
    propertyType: PropertyType[];
  }>>;
  togglePropertyType: (type: PropertyType) => void;
  clearFilters: () => void;
  handleSearch: () => void;
}

const FilterPanel = ({ 
  searchParams,
  setSearchParams,
  togglePropertyType,
  clearFilters,
  handleSearch
}: FilterPanelProps) => {
  return (
    <div className="bg-white mt-4 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium text-zen-gray-700">Price Range</Label>
          <div className="mt-2">
            <div className="flex justify-between mb-2">
              <span>{formatCurrency(searchParams.minPrice)}</span>
              <span>{formatCurrency(searchParams.maxPrice)}</span>
            </div>
            <Slider
              defaultValue={[searchParams.minPrice, searchParams.maxPrice]}
              max={3000000}
              step={50000}
              onValueChange={(value) =>
                setSearchParams({
                  ...searchParams,
                  minPrice: value[0],
                  maxPrice: value[1],
                })
              }
              className="my-4"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-zen-gray-700">Bedrooms</Label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {["Any", "1+", "2+", "3+", "4+", "5+"].map((option, index) => (
              <Button
                key={option}
                type="button"
                variant={searchParams.bedrooms === index - 1 ? "default" : "outline"}
                className={`text-sm py-1 px-2 h-auto ${
                  searchParams.bedrooms === index - 1
                    ? "bg-zen-blue-500"
                    : "border-zen-gray-300"
                }`}
                onClick={() =>
                  setSearchParams({ ...searchParams, bedrooms: index - 1 })
                }
              >
                {option}
              </Button>
            ))}
          </div>
          
          <Label className="text-sm font-medium text-zen-gray-700 mt-4 block">Bathrooms</Label>
          <div className="mt-2 grid grid-cols-6 gap-2">
            {["Any", "1+", "2+", "3+", "4+", "5+"].map((option, index) => (
              <Button
                key={option}
                type="button"
                variant={searchParams.bathrooms === index - 1 ? "default" : "outline"}
                className={`text-sm py-1 px-2 h-auto ${
                  searchParams.bathrooms === index - 1
                    ? "bg-zen-blue-500"
                    : "border-zen-gray-300"
                }`}
                onClick={() =>
                  setSearchParams({ ...searchParams, bathrooms: index - 1 })
                }
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium text-zen-gray-700">Property Type</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.values(PropertyType).map((type) => (
              <Button
                key={type}
                type="button"
                variant="outline"
                className={`text-sm py-1 px-2 h-auto flex justify-between items-center ${
                  searchParams.propertyType.includes(type)
                    ? "border-zen-blue-500 bg-zen-blue-50"
                    : "border-zen-gray-300"
                }`}
                onClick={() => togglePropertyType(type)}
              >
                <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                {searchParams.propertyType.includes(type) && (
                  <Check className="h-4 w-4 ml-2 text-zen-blue-500" />
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button variant="outline" onClick={clearFilters} className="mr-2">
          Clear Filters
        </Button>
        <Button onClick={handleSearch}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterPanel;
