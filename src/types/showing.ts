
import { ShowingStatus } from './enums';

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

export interface ViewingRequest {
  id: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  requestedDate: string;
  requestedTimeStart: string;
  requestedTimeEnd: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED' | 'COMPLETED';
  buyerNotes?: string;
  sellerNotes?: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}
