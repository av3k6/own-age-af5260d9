
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyType } from "@/types";

interface SearchBarProps {
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
  isFilterOpen: boolean;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSearch: () => void;
}

const SearchBar = ({ 
  searchParams, 
  setSearchParams, 
  isFilterOpen, 
  setIsFilterOpen, 
  handleSearch 
}: SearchBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center gap-4">
      <div className="flex-1 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zen-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="City, neighborhood, or ZIP"
            className="pl-10"
            value={searchParams.location}
            onChange={(e) =>
              setSearchParams({ ...searchParams, location: e.target.value })
            }
          />
        </div>
      </div>
      
      <Button 
        className="w-full md:w-auto whitespace-nowrap"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
        {isFilterOpen ? (
          <ChevronUp className="h-4 w-4 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2" />
        )}
      </Button>
      
      <Button 
        className="w-full md:w-auto" 
        onClick={handleSearch}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default SearchBar;
