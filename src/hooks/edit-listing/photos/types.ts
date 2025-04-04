
export interface PropertyPhoto {
  id: string;
  property_id: string;
  url: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface PhotoUploadResult {
  success: boolean;
  error?: string;
  uploadedFiles?: File[];
  count?: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}
