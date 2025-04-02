
import { DocumentMetadata } from "./document";

export interface PropertyDocument extends DocumentMetadata {
  property_id: string;
  document_type: 'floor_plan' | 'contract' | 'inspection' | 'other';
  description?: string;
  tags?: string[];
}

export interface DocumentUploadResult {
  success: boolean;
  document?: PropertyDocument;
  error?: string;
}

export type DocumentCategory = 'floor_plans' | 'contracts' | 'inspections' | 'other';
