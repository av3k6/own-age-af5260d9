
export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller",
  PROFESSIONAL = "professional",
  ADMIN = "admin",
}

export enum PropertyType {
  HOUSE = "house",
  APARTMENT = "apartment",
  CONDO = "condo",
  TOWNHOUSE = "townhouse",
  LAND = "land",
  COMMERCIAL = "commercial",
  OTHER = "other",
}

export enum ListingStatus {
  ACTIVE = "active",
  PENDING = "pending",
  SOLD = "sold",
  EXPIRED = "expired",
}

export enum ProfessionalType {
  INSPECTOR = "inspector",
  CONTRACTOR = "contractor",
  LAWYER = "lawyer",
  APPRAISER = "appraiser",
  OTHER = "other",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
}

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
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface Professional {
  id: string;
  userId: string;
  professionalType: ProfessionalType;
  licenseNumber: string;
  companyName?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  servicesOffered: string[];
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  rating: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Showing {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  startTime: Date;
  endTime: Date;
  status: 'requested' | 'approved' | 'declined' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  contingencies: string[];
  deadline: Date;
  status: 'pending' | 'accepted' | 'countered' | 'rejected' | 'withdrawn';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
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
