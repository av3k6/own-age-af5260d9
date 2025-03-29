
import { useState } from "react";
import { Link } from "react-router-dom";
import { PropertyListing } from "@/types";
import { Button } from "@/components/ui/button";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyInformation from "./PropertyInformation";
import PropertyDescription from "./PropertyDescription";
import PropertyFeatures from "./PropertyFeatures";
import PropertyLocation from "./PropertyLocation";
import PropertyProfessionals from "./PropertyProfessionals";
import PropertySimilar from "./PropertySimilar";
import MortgageCalculator from "./MortgageCalculator";
import PropertyRoomDetails from "./room-details/PropertyRoomDetails";

interface PropertyDetailViewProps {
  property: PropertyListing;
}

export default function PropertyDetailView({ property }: PropertyDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState<string>(property.images[0]);

  // Sample room data for demonstration
  const bedroomData = property.roomDetails?.bedrooms || [
    { name: 'Primary bedroom', level: 'Second', dimensions: '4.04 x 8.66' },
    { name: 'Bedroom', level: 'Basement', dimensions: '4.65 x 3.82' },
    { name: 'Bedroom 2', level: 'Second', dimensions: '4.98 x 5.08' },
    { name: 'Bedroom 3', level: 'Second', dimensions: '4.81 x 3.82' },
    { name: 'Bedroom 4', level: 'Second', dimensions: '4.09 x 4.52' },
    { name: 'Bedroom 5', level: 'Second', dimensions: '3.64 x 4.78' },
  ];
  
  const otherRoomData = property.roomDetails?.otherRooms || [
    { name: 'Breakfast', level: 'Main', dimensions: '3.27 x 4.2' },
    { name: 'Dining room', level: 'Main', dimensions: '3.63 x 5.4' },
    { name: 'Exercise room', level: 'Basement', dimensions: '7.17 x 3.93' },
    { name: 'Family room', level: 'Main', dimensions: '4.72 x 4.62' },
    { name: 'Kitchen', level: 'Main', dimensions: '4.33 x 3.47' },
    { name: 'Laundry', level: 'Main', dimensions: '2.56 x 3.67' },
    { name: 'Living room', level: 'Main', dimensions: '3.98 x 4.94' },
    { name: 'Office', level: 'Main', dimensions: '3.43 x 3.31' },
    { name: 'Recreation', level: 'Basement', dimensions: '8.91 x 4.5' },
    { name: 'Workshop', level: 'Basement', dimensions: '4.01 x 3.17' },
  ];

  // Sample property details data with the listing information mentioned by the user
  const propertyDetails = property.roomDetails || {
    construction: 'Brick',
    basement: 'Finished',
    pool: 'Above Ground',
    driveway: 'Private Double',
    garageType: 'Attached',
    garageSpaces: 3,
    totalParkingSpaces: 12,
    parkingFeatures: ['Private Double', 'Garage Door Opener'],
    frontage: '70',
    depth: '180',
    lotSize: '70 x 180 feet',
    lotSizeCode: 'Feet',
    crossStreet: 'Adelaide Ave W / Stevenson Rd N',
    water: 'Municipal',
    cooling: 'Central Air',
    heating: 'Forced Air',
    heatingFuel: 'Gas',
    sewer: 'Sewer',
    taxes: '$9,464',
    taxYear: '2024',
    style: '2-Storey',
    frontingOn: 'East',
    community: 'McLaughlin',
    municipality: 'Oshawa',
    kitchens: 1,
    familyRoom: true,
    centralVac: true,
    fireplace: true,
    listingNumber: 'E12040297',
    dataSource: 'PROPTX',
    daysOnMarket: 4,
    propertyDaysOnMarket: 31,
    statusChange: '3 days ago',
    listedOn: new Date('2025-03-24'),
    updatedOn: new Date('2025-03-25'),
    predictedDaysOnMarket: 20,
    marketDemand: 'balanced',
    listingBrokerage: 'DAN PLOWMAN TEAM REALTY INC.'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/buy" className="text-zen-blue-500 hover:text-zen-blue-600">
              &larr; Back to Search Results
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image Gallery */}
            <div className="lg:w-2/3">
              <PropertyImageGallery 
                images={property.images} 
                selectedImage={selectedImage}
                onSelectImage={setSelectedImage}
                title={property.title}
              />
            </div>
            
            {/* Property Information */}
            <div className="lg:w-1/3">
              <PropertyInformation property={property} />
            </div>
          </div>
          
          {/* Property Details */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PropertyDescription description={property.description} />
              <div className="mt-8">
                <PropertyRoomDetails 
                  bedrooms={bedroomData}
                  otherRooms={otherRoomData}
                  propertyDetails={propertyDetails}
                  propertyTitle={property.title}
                  propertyPrice={property.price}
                  listingStatus={property.status}
                />
              </div>
              <div className="mt-8">
                <PropertyFeatures features={property.features} />
              </div>
              <div className="mt-8">
                <PropertyLocation address={property.address} />
              </div>
              <div className="mt-8">
                <MortgageCalculator propertyPrice={property.price} />
              </div>
            </div>
            
            <div>
              <PropertyProfessionals />
              <PropertySimilar 
                currentPropertyId={property.id} 
                propertyType={property.propertyType} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
