
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockListings } from "@/data/mockData";
import { PropertyListing } from "@/types";
import { Button } from "@/components/ui/button";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import PropertyDetailView from "@/components/property/PropertyDetailView";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyListing | null>(null);

  useEffect(() => {
    // Simulate data fetching
    // In a real app, you'd fetch from an API
    const fetchedProperty = mockListings.find((listing) => listing.id === id);
    
    if (fetchedProperty) {
      setProperty(fetchedProperty);
    }
  }, [id]);

  if (!property) {
    return <PropertyNotFound />;
  }

  return <PropertyDetailView property={property} />;
};

export default PropertyDetail;
