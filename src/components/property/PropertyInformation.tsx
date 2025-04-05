
import { PropertyListing } from "@/types";
import PropertyInformationHeader from "./information/PropertyInformationHeader";
import OwnerActions from "./information/OwnerActions";
import BuyerActions from "./information/BuyerActions";
import SellerInfo from "./information/SellerInfo";
import { usePropertyStatus } from "./information/usePropertyStatus";

interface PropertyInformationProps {
  property: PropertyListing;
}

export default function PropertyInformation({ property }: PropertyInformationProps) {
  const { status, isUpdating, isOwner, toggleListingStatus } = usePropertyStatus(property);

  // Determine seller display name based on ownership and available data
  const sellerDisplayName = isOwner 
    ? "You (Property Owner)" 
    : property.sellerName || "Property Owner";

  // In a full implementation, these would be fetched from user preferences
  const showCallButton = true; // This would be from user preferences
  const showTextButton = true; // This would be from user preferences

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <PropertyInformationHeader property={property} status={status} />
      
      {isOwner ? (
        <OwnerActions 
          property={property} 
          status={status} 
          isUpdating={isUpdating} 
          onToggleStatus={toggleListingStatus} 
        />
      ) : (
        <BuyerActions 
          propertyId={property.id} 
          propertyTitle={property.title} 
          sellerId={property.sellerId} 
        />
      )}
      
      <SellerInfo 
        sellerDisplayName={sellerDisplayName}
        isOwner={isOwner}
        showCallButton={showCallButton}
        showTextButton={showTextButton}
      />
    </div>
  );
}
