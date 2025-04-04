
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
