
/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted string like "1.5 MB" or "800 KB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets the file extension from a filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Checks if a file is an image based on its extension or type
 */
export const isImageFile = (file: File | string): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  if (typeof file === 'string') {
    const extension = getFileExtension(file);
    return imageExtensions.includes(extension);
  }
  
  return imageTypes.includes(file.type);
};

import { File as FileIcon } from 'lucide-react';

/**
 * Returns the color class for a file icon based on the file extension
 * @param fileName File name with extension
 * @returns A color string to be used with the file icon
 */
export const getFileIconColor = (fileName: string): string => {
  const extension = getFileExtension(fileName);
  
  switch(extension) {
    case 'pdf':
      return 'text-red-500';
    case 'dwg':
    case 'dxf':
      return 'text-blue-500';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * Returns the appropriate file icon props for a given file name
 * This is a utility function that doesn't return JSX elements directly
 * It is used in components that render file icons
 * 
 * @param fileName File name with extension
 * @returns Props to be applied to a FileIcon component
 */
export const getFileIconProps = (fileName: string) => {
  return {
    className: `h-8 w-8 ${getFileIconColor(fileName)}`,
  };
};
