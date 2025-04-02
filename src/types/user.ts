
import { UserRole } from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  isAdmin?: boolean; // Add the isAdmin property
  user_metadata?: {
    full_name?: string;
    name?: string;
    phone?: string;
    role?: UserRole | string;
    bio?: string;
    avatar_url?: string;
    address?: {
      street: string;
      city: string;
      province: string;
      postalCode: string;
      country: string;
    };
    preferredLocations?: string[];
    budgetRange?: {
      min: number;
      max: number;
    };
    propertyTypePreferences?: string[];
    serviceType?: string;
    companyName?: string;
    licenseNumber?: string;
  };
  app_metadata?: Record<string, any>;
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

import { ProfessionalType } from './enums';
