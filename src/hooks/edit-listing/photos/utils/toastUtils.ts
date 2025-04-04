
import { toast } from "@/hooks/use-toast";

const showSuccessToast = (message: string) => {
  toast({
    title: "Success",
    description: message,
  });
};

const showErrorToast = (message: string, error?: any) => {
  if (error) {
    console.error(message, error);
  }
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

const showWarningToast = (message: string) => {
  toast({
    title: "Warning",
    description: message,
    variant: "destructive",
  });
};

export const photoToasts = {
  databaseError: () => showErrorToast("Could not prepare the database for photo uploads. Your permissions may be limited."),
  storageError: () => showErrorToast("Could not prepare the storage for photo uploads. Please try again later."),
  uploadError: (fileName: string, error?: string) => showErrorToast(error || `Failed to upload ${fileName}`),
  saveError: (fileName: string) => showErrorToast(`Failed to save photo record for ${fileName}`),
  noneUploaded: () => showErrorToast("None of the photos could be uploaded. Please try again."),
  unexpectedError: (error: any) => showErrorToast("An unexpected error occurred. Please try again later.", error),
  uploadSuccess: (count: number) => showSuccessToast(`${count} photo${count === 1 ? '' : 's'} uploaded successfully`),
};
