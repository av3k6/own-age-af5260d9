
import { useState, useEffect } from "react";
import { mockListings } from "@/data/mockData";
import { PropertyListing, ListingStatus } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

import PropertyGrid from "./components/PropertyGrid";
import SearchBar from "./components/SearchBar";
import FilterPanel from "./components/FilterPanel";
import ResultsHeader from "./components/ResultsHeader";

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
          
          <SearchBar 
            searchParams={searchParams} 
            setSearchParams={setSearchParams}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            handleSearch={handleSearch}
          />
          
          {isFilterOpen && (
            <FilterPanel 
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              togglePropertyType={togglePropertyType}
              clearFilters={clearFilters}
              handleSearch={handleSearch}
            />
          )}
        </div>
      </div>
      
      <div className="container px-4 py-8 mx-auto">
        <ResultsHeader 
          count={filteredListings.length}
        />
        
        <PropertyGrid 
          listings={filteredListings}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default Buy;
