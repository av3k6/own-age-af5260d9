
import { createLogger } from "@/utils/logger";

const logger = createLogger("photoValidationUtils");

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a file to ensure it meets photo requirements
 * @param file File to validate
 * @returns Validation result
 */
export const validatePhotoFile = (file: File): ValidationResult => {
  // Validate file type
  const fileType = file.type.toLowerCase();
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(fileType)) {
    logger.warn(`Invalid file type: ${fileType} for file ${file.name}`);
    return { 
      valid: false, 
      error: `File ${file.name} is not a supported image type. Only JPG, PNG, and WebP are accepted.` 
    };
  }
  
  // Validate file size (5MB limit)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    logger.warn(`File too large: ${file.size} bytes for file ${file.name}`);
    return { 
      valid: false, 
      error: `File ${file.name} exceeds the 5MB limit.` 
    };
  }
  
  return { valid: true };
};
