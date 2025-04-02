
export interface PropertyPhoto {
  id: string;
  url: string;
  display_order: number;
  is_primary: boolean;
}

export interface PhotoUploadResult {
  success: boolean;
  error?: string;
  uploadedFiles?: File[];
}
