
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

export enum ShowingStatus {
  REQUESTED = "requested",
  APPROVED = "approved",
  DECLINED = "declined",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}
