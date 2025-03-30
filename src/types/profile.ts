
export interface UserAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface UserProfileData {
  fullName: string;
  phone: string;
  bio: string;
  role: string;
  address: UserAddress;
  preferredLocations: string[];
  budgetMin: number;
  budgetMax: number;
  propertyTypePreferences: string[];
  serviceType: string;
  companyName: string;
  licenseNumber: string;
}
