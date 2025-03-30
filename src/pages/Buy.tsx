import { useState, useEffect } from "react";
import { mockListings } from "@/data/mockData";
import { PropertyListing, PropertyType, ListingStatus } from "@/types";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatters";
import { Check, ChevronDown, ChevronUp, Search, SlidersHorizontal } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

const Buy = () => {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PropertyListing[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState({
    location: "",
    minPrice: 0,
    maxPrice: 3000000,
    bedrooms: 0,
    bathrooms: 0,
    propertyType: [] as PropertyType[],
  });

  useEffect(() => {
    const fetchListings = async () => {
      let allListings = [...mockListings];

      allListings = allListings.filter(listing => listing.status === ListingStatus.ACTIVE);

      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('status', ListingStatus.ACTIVE);

        if (data && !error) {
          const supabaseListings = data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            address: item.address,
            propertyType: item.property_type,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            squareFeet: item.square_feet,
            yearBuilt: item.year_built,
            features: item.features || [],
            images: item.images || [],
            sellerId: item.seller_id,
            status: item.status,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
          })) as PropertyListing[];

          allListings = [...allListings, ...supabaseListings];
        }
      } catch (err) {
        console.error("Failed to fetch listings from Supabase:", err);
      }

      setListings(allListings);
      setFilteredListings(allListings);
    };

    fetchListings();
  }, [supabase]);

  const handleSearch = () => {
    let filtered = listings;

    if (searchParams.location) {
      const searchTerm = searchParams.location.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.address.city.toLowerCase().includes(searchTerm) ||
          listing.address.state.toLowerCase().includes(searchTerm) ||
          listing.address.zipCode.toLowerCase().includes(searchTerm) ||
          listing.address.street.toLowerCase().includes(searchTerm)
      );
    }

    filtered = filtered.filter(
      (listing) =>
        listing.price >= searchParams.minPrice &&
        listing.price <= searchParams.maxPrice
    );

    if (searchParams.bedrooms > 0) {
      filtered = filtered.filter(
        (listing) => listing.bedrooms >= searchParams.bedrooms
      );
    }

    if (searchParams.bathrooms > 0) {
      filtered = filtered.filter(
        (listing) => listing.bathrooms >= searchParams.bathrooms
      );
    }

    if (searchParams.propertyType.length > 0) {
      filtered = filtered.filter((listing) =>
        searchParams.propertyType.includes(listing.propertyType)
      );
    }

    setFilteredListings(filtered);
  };

  const togglePropertyType = (type: PropertyType) => {
    if (searchParams.propertyType.includes(type)) {
      setSearchParams({
        ...searchParams,
        propertyType: searchParams.propertyType.filter((t) => t !== type),
      });
    } else {
      setSearchParams({
        ...searchParams,
        propertyType: [...searchParams.propertyType, type],
      });
    }
  };

  const clearFilters = () => {
    setSearchParams({
      location: "",
      minPrice: 0,
      maxPrice: 3000000,
      bedrooms: 0,
      bathrooms: 0,
      propertyType: [],
    });
    setFilteredListings(listings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-zen-blue-500 py-12">
        <div className="container px-4 mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Dream Home</h1>
          
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
          
          {isFilterOpen && (
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
          )}
        </div>
      </div>
      
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-zen-gray-800">
            {filteredListings.length} Properties Found
          </h2>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="sort" className="text-sm font-medium text-zen-gray-700">
              Sort by:
            </Label>
            <select
              id="sort"
              className="border rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-zen-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="beds-desc">Most Bedrooms</option>
              <option value="baths-desc">Most Bathrooms</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <PropertyCard key={listing.id} property={listing} />
          ))}
        </div>
        
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-zen-gray-800 mb-2">
              No properties found
            </h3>
            <p className="text-zen-gray-600">
              Try adjusting your search criteria or clear filters to see more results.
            </p>
            <Button onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy;
