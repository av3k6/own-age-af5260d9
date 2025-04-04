
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

/**
 * Returns the appropriate file icon component for a given file name
 * @param fileName File name with extension
 * @returns A JSX element representing the file icon
 */
import { File as FileIcon } from 'lucide-react';

export const getFileIcon = (fileName: string) => {
  const extension = getFileExtension(fileName);
  
  const iconProps = {
    className: "h-8 w-8",
  };
  
  switch(extension) {
    case 'pdf':
      return <FileIcon {...iconProps} className="h-8 w-8 text-red-500" />;
    case 'dwg':
    case 'dxf':
      return <FileIcon {...iconProps} className="h-8 w-8 text-blue-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <FileIcon {...iconProps} className="h-8 w-8 text-green-500" />;
    default:
      return <FileIcon {...iconProps} className="h-8 w-8 text-gray-500" />;
  }
};
