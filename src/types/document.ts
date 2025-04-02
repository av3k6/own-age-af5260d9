
export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt?: string;
  propertyId?: string;
  category?: string;
  description?: string;
}

export interface DocumentUploadOptions {
  allowMultiple?: boolean;
  maxSizeMB?: number;
  allowedTypes?: string[];
}
