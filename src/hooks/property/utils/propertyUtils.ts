
/**
 * Validates if a string is a valid UUID
 * @param id String to check
 * @returns boolean indicating if the string is a valid UUID
 */
export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

/**
 * Additional property utility functions can be added here
 */
