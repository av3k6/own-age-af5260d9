
import { PropertyType, ListingStatus } from './enums';

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  price: number;
  address: Address;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  features: string[];
  images: string[];
  sellerId: string;
  sellerName?: string;
  sellerEmail?: string;
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  roomDetails?: PropertyRoomDetails;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Room {
  name: string;
  level: string;
  dimensions?: string;
  features?: string[];
}

export interface PropertyRoomDetails {
  bedrooms?: Room[];
  otherRooms?: Room[];
  heating?: string;
  cooling?: string;
  appliances?: { name: string; value: string }[];
  parkingSpaces?: number;
  lotSize?: string;
  stories?: number;
  construction?: string;
  basement?: string;
  pool?: string;
  poolFeatures?: string[];
  garageType?: string;
  garageSpaces?: number;
  driveway?: string;
  totalParkingSpaces?: number;
  parkingFeatures?: string[];
  frontage?: string;
  depth?: string;
  lotSizeCode?: string;
  kitchens?: number;
  familyRoom?: boolean;
  centralVac?: boolean;
  fireplace?: boolean;
  water?: string;
  heatingFuel?: string;
  sewer?: string;
  taxes?: string;
  taxYear?: string;
  style?: string;
  frontingOn?: string;
  community?: string;
  municipality?: string;
  crossStreet?: string;
  daysOnMarket?: number;
  propertyDaysOnMarket?: number;
  statusChange?: string;
  listedOn?: Date;
  updatedOn?: Date;
  listingNumber?: string;
  dataSource?: string;
  predictedDaysOnMarket?: number;
  marketDemand?: 'buyer' | 'balanced' | 'seller';
  listingBrokerage?: string;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  propertyId?: string;
  offerId?: string;
  createdAt: Date;
}
