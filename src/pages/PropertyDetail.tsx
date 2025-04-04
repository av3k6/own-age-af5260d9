
import { useParams } from "react-router-dom";
import { usePropertyDetail } from "@/hooks/property/usePropertyDetail";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import PropertyDetailLoading from "@/components/property/PropertyDetailLoading";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isLoading, errorType } = usePropertyDetail(id);

  if (isLoading) {
    return <PropertyDetailLoading />;
  }

  if (!property) {
    return <PropertyNotFound errorType={errorType} propertyId={id} />;
  }

  return <PropertyDetailView property={property} />;
};

export default PropertyDetail;
