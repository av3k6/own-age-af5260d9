
import { useParams } from "react-router-dom";
import { usePropertyDetail } from "@/hooks/property/detail/usePropertyDetail";
import PropertyNotFound from "@/components/property/PropertyNotFound";
import PropertyDetailView from "@/components/property/PropertyDetailView";
import PropertyDetailLoading from "@/components/property/PropertyDetailLoading";
import { useEffect } from "react";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PropertyDetail");

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { property, isLoading, errorType } = usePropertyDetail(id);

  // Add additional debugging for floor plans issues
  useEffect(() => {
    if (property) {
      logger.info("Property data loaded successfully:", {
        id: property.id,
        hasRoomDetails: !!property.roomDetails,
        status: property.status
      });
    }
  }, [property]);

  if (isLoading) {
    return <PropertyDetailLoading />;
  }

  if (!property) {
    return <PropertyNotFound errorType={errorType} propertyId={id} />;
  }

  return <PropertyDetailView property={property} />;
};

export default PropertyDetail;
