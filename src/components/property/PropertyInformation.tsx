import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyListing, ListingStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Edit, Mail, MessageSquare, Phone, User, EyeOff, Eye } from "lucide-react";
import ScheduleShowingDialog from "./showing/ScheduleShowingDialog";
import ContactSellerDialog from "./contact/ContactSellerDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

interface PropertyInformationProps {
  property: PropertyListing;
}

export default function PropertyInformation({ property }: PropertyInformationProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const isOwner = user?.id === property.sellerId;
  const [status, setStatus] = useState<ListingStatus>(property.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine seller display name based on ownership
  const sellerDisplayName = isOwner ? "You (Property Owner)" : property.sellerName || "Property Owner";

  // Function to toggle listing status
  const toggleListingStatus = async () => {
    if (!isOwner) return;
    
    setIsUpdating(true);
    const newStatus = status === ListingStatus.ACTIVE ? ListingStatus.PENDING : ListingStatus.ACTIVE;
    
    try {
      const { error } = await supabase
        .from("property_listings")
        .update({ status: newStatus })
        .eq("id", property.id)
        .eq("seller_id", user!.id);

      if (error) throw error;
      
      setStatus(newStatus);
      toast({
        title: "Status Updated",
        description: `Listing is now ${newStatus === ListingStatus.ACTIVE ? "active" : "pending"}.`,
      });
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast({
        title: "Update Failed",
        description: "Could not update listing status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-zen-blue-500 rounded-full mb-2">
            {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
          </span>
          
          <span className={`inline-block px-3 py-1 text-sm font-medium text-white rounded-full mb-2 ${
            status === ListingStatus.ACTIVE ? 'bg-green-500' : 'bg-yellow-500'
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        
        <h1 className="text-2xl font-bold text-zen-gray-800 mb-2">
          {property.title}
        </h1>
        
        <p className="text-zen-gray-600 mb-2">
          {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
        </p>
        
        <p className="text-2xl font-bold text-zen-blue-500 mb-2">
          {formatCurrency(property.price)}
        </p>
        
        <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 my-4">
          <div className="text-center">
            <p className="text-lg font-medium">{property.bedrooms}</p>
            <p className="text-xs text-zen-gray-600">Beds</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">{property.bathrooms}</p>
            <p className="text-xs text-zen-gray-600">Baths</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">{property.squareFeet.toLocaleString()}</p>
            <p className="text-xs text-zen-gray-600">Sq Ft</p>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-medium">{property.yearBuilit || 'N/A'}</p>
            <p className="text-xs text-zen-gray-600">Year Built</p>
          </div>
        </div>
      </div>
      
      {isOwner ? (
        <div className="space-y-3">
          <Link to={`/edit-listing/${property.id}`}>
            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={toggleListingStatus}
            disabled={isUpdating}
          >
            {isUpdating ? (
              "Updating..."
            ) : (
              <>
                {status === ListingStatus.ACTIVE ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                {status === ListingStatus.ACTIVE ? "Set to Pending" : "Set to Active"}
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div id="schedule-showing-button">
            <ScheduleShowingDialog 
              propertyId={property.id} 
              propertyTitle={property.title}
              sellerId={property.sellerId}
            />
          </div>
          
          <div id="contact-seller-button">
            <ContactSellerDialog
              propertyId={property.id}
              propertyTitle={property.title}
              sellerId={property.sellerId}
            />
          </div>
          
          <Link to={`/property/${property.id}/make-offer`}>
            <Button variant="secondary" className="w-full">
              Make an Offer
            </Button>
          </Link>
        </div>
      )}
      
      <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="flex items-center mb-4">
          <User className="h-10 w-10 bg-zen-blue-100 text-zen-blue-500 p-2 rounded-full mr-3" />
          <div>
            <h3 className="font-medium">{sellerDisplayName}</h3>
            <p className="text-sm text-zen-gray-600">Property Owner</p>
          </div>
        </div>
        
        {!isOwner && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
