
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockListings } from "@/data/mockData";
import { PropertyListing } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Calendar, Home, Info, MessageSquare, Phone, User } from "lucide-react";
import ScheduleShowingDialog from "@/components/property/ScheduleShowingDialog";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    // Simulate data fetching
    // In a real app, you'd fetch from an API
    const fetchedProperty = mockListings.find((listing) => listing.id === id);
    
    if (fetchedProperty) {
      setProperty(fetchedProperty);
      setSelectedImage(fetchedProperty.images[0]);
    }
  }, [id]);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-zen-gray-800 mb-4">Property not found</h2>
        <p className="text-zen-gray-600 mb-6">
          The property you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/buy">
          <Button>Browse Properties</Button>
        </Link>
      </div>
    );
  }

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
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedImage}
                  alt={property.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                      selectedImage === image
                        ? "border-zen-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - view ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Property Information */}
            <div className="lg:w-1/3">
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
                
                <div className="space-y-3">
                  <ScheduleShowingDialog 
                    propertyId={property.id} 
                    propertyTitle={property.title}
                  />
                  
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  
                  <Link to={`/property/${property.id}/make-offer`}>
                    <Button variant="secondary" className="w-full">
                      Make an Offer
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center mb-4">
                    <User className="h-10 w-10 bg-zen-blue-100 text-zen-blue-500 p-2 rounded-full mr-3" />
                    <div>
                      <h3 className="font-medium">Seller Name</h3>
                      <p className="text-sm text-zen-gray-600">Property Owner</p>
                    </div>
                  </div>
                  
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
                </div>
              </div>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Description</h2>
                <p className="text-zen-gray-600 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
              
              <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Property Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-zen-blue-500 rounded-full mr-2"></div>
                      <span className="text-zen-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Location</h2>
                <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBtdr4-5ew-7RzY5CvMo-jugKI-AR0NNY8&q=${encodeURIComponent(
                      `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                    )}`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Connect with Professionals</h2>
                <p className="text-zen-gray-600 mb-4">
                  Book services from our vetted professionals to help with your transaction.
                </p>
                
                <div className="space-y-4">
                  <Link to="/professionals/inspectors">
                    <Button variant="outline" className="w-full justify-start">
                      <Info className="h-4 w-4 mr-2" />
                      Home Inspectors
                    </Button>
                  </Link>
                  
                  <Link to="/professionals/contractors">
                    <Button variant="outline" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Contractors
                    </Button>
                  </Link>
                  
                  <Link to="/professionals/lawyers">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Real Estate Lawyers
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Similar Properties</h2>
                
                <div className="space-y-4">
                  {mockListings
                    .filter(
                      (listing) =>
                        listing.id !== property.id &&
                        listing.propertyType === property.propertyType
                    )
                    .slice(0, 3)
                    .map((listing) => (
                      <Link key={listing.id} to={`/property/${listing.id}`}>
                        <div className="flex space-x-3 group">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          
                          <div>
                            <h3 className="font-medium text-zen-gray-800 group-hover:text-zen-blue-500 transition-colors">
                              {listing.title}
                            </h3>
                            
                            <p className="text-zen-blue-500 text-sm font-medium">
                              {formatCurrency(listing.price)}
                            </p>
                            
                            <p className="text-zen-gray-600 text-xs">
                              {listing.bedrooms} bd • {listing.bathrooms} ba • {listing.squareFeet.toLocaleString()} sqft
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
