
import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyListing } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Edit, Mail, MessageSquare, Phone, User } from "lucide-react";
import ScheduleShowingDialog from "./ScheduleShowingDialog";
import ContactSellerDialog from "./ContactSellerDialog";
import { useAuth } from "@/contexts/AuthContext";

interface PropertyInformationProps {
  property: PropertyListing;
}

export default function PropertyInformation({ property }: PropertyInformationProps) {
  const { user } = useAuth();
  const isOwner = user?.id === property.sellerId;

  // Determine seller display name based on ownership
  const sellerDisplayName = isOwner ? "Justin Redmond" : "Seller";

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-zen-blue-500 rounded-full mb-2">
          {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
        </span>
        
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
            <p className="text-lg font-medium">{property.yearBuilt}</p>
            <p className="text-xs text-zen-gray-600">Year Built</p>
          </div>
        </div>
      </div>
      
      {isOwner ? (
        <div className="space-y-3">
          <Link to={`/property/${property.id}/edit`}>
            <Button className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <ScheduleShowingDialog 
            propertyId={property.id} 
            propertyTitle={property.title}
          />
          
          <ContactSellerDialog
            propertyId={property.id}
            propertyTitle={property.title}
            sellerId={property.sellerId}
          />
          
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
