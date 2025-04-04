
// Define storage bucket constants
export const STORAGE_BUCKETS = {
  DEFAULT: 'storage',
  PROPERTY_PHOTOS: 'property-photos',
  DOCUMENTS: 'documents',
  PROFILE_PHOTOS: 'profile-photos'
};

// Re-export Supabase specific bucket utility functions
export { 
  verifyBucketAccess,
  safeUploadFile,
  getPublicFileUrl 
} from '@/utils/supabase/bucketUtils';
