
export interface DocumentMetadata {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  path: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  description?: string;
  version?: number;
  versionHistory?: {
    version: number;
    url: string;
    updatedAt: string;
  }[];
  permissions?: {
    public: boolean;
    sharedWith: string[];
    accessType: 'view' | 'download' | 'edit';
  };
  propertyId?: string;
  tags?: string[];
}
