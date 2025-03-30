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

export interface Room {
  name: string;
  level: string;
  dimensions?: string;
  features?: string[];
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
  roomDetails?: PropertyRoomDetails;
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

export enum ShowingStatus {
  REQUESTED = "requested",
  APPROVED = "approved",
  DECLINED = "declined",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Showing {
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  sellerId: string;
  startTime: Date;
  endTime: Date;
  status: ShowingStatus;
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

export interface SellerAvailability {
  id: string;
  sellerId: string;
  propertyId: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, etc.
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status?: ShowingStatus;
  buyerName?: string;
}

export interface ExternalCalendarConfig {
  provider: 'google' | 'apple' | 'outlook';
  isEnabled: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiry?: Date;
  calendarId?: string;
}

export interface NotificationPreference {
  userId: string;
  showingRequests: boolean;
  showingUpdates: boolean;
  offerUpdates: boolean;
  messageAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderHours: number; // hours before event to send reminder
}
