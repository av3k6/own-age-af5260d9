
export interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onUpload: (files: File[]) => Promise<boolean> | void;
  isUploading?: boolean;
  autoUpload?: boolean;
}

export interface SelectedFile {
  file: File;
  id: string;
}
