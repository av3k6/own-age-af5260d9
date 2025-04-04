
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";

const logger = createLogger("useDocumentUpload");

export interface UploadableDocument {
  file: File;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  id?: string;
  url?: string;
  path?: string;
}

interface UseDocumentUploadOptions {
  maxSizeMB?: number;
  allowedFileTypes?: string[];
  folder?: string;
}

export const useDocumentUpload = (options: UseDocumentUploadOptions = {}) => {
  const { 
    maxSizeMB = 10, 
    allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain'],
    folder = 'documents'
  } = options;
  
  const [documents, setDocuments] = useState<UploadableDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { safeUpload, safeGetPublicUrl } = useSupabase();
  const { toast } = useToast();
  
  const validateFile = (file: File): { valid: boolean; reason?: string } => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, reason: `File size exceeds ${maxSizeMB}MB limit` };
    }
    
    // Check if file type is allowed or if extension is allowed for application/octet-stream
    if (file.type === 'application/octet-stream') {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt', '.xls', '.xlsx'];
      if (extension && allowedExtensions.includes(`.${extension}`)) {
        return { valid: true };
      }
    }
    
    if (!allowedFileTypes.includes(file.type)) {
      return { valid: false, reason: `File type ${file.type} is not supported` };
    }
    
    return { valid: true };
  };
  
  const addDocuments = (newFiles: FileList | File[]) => {
    const filesToAdd = Array.from(newFiles).map(file => {
      const validation = validateFile(file);
      
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.reason,
          variant: "destructive",
        });
        return null;
      }
      
      return {
        file,
        progress: 0,
        status: 'idle' as const,
      };
    }).filter(Boolean) as UploadableDocument[];
    
    setDocuments(prev => [...prev, ...filesToAdd]);
    return filesToAdd.length > 0;
  };
  
  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadDocuments = async (userId?: string, customFolder?: string) => {
    if (documents.length === 0) return { success: true, uploaded: 0, failed: 0 };
    
    setIsUploading(true);
    let uploaded = 0;
    let failed = 0;
    let successfulDocuments: UploadableDocument[] = [];
    
    try {
      logger.info(`Starting upload of ${documents.length} documents`);
      
      const uploadPromises = documents.map(async (doc, index) => {
        if (doc.status === 'success') {
          uploaded++;
          return doc;
        }
        
        // Update status to uploading
        setDocuments(prev => 
          prev.map((d, i) => i === index ? { ...d, status: 'uploading' as const } : d)
        );
        
        try {
          const folderPathBase = customFolder || folder;
          const folderPath = userId 
            ? `${folderPathBase}/${userId}` 
            : folderPathBase;
            
          const filePath = `${folderPath}/${Date.now()}-${doc.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          logger.info(`Uploading document ${index + 1}/${documents.length}: ${filePath}`);
          
          // Use our enhanced upload function with fallback
          const { data, error } = await safeUpload(filePath, doc.file, {
            cacheControl: '3600',
            upsert: false,
          });
            
          if (error) {
            logger.error(`Error uploading document ${index + 1}:`, error);
            throw error;
          }
          
          // Simulate upload completed
          setDocuments(prev => 
            prev.map((d, i) => i === index ? { ...d, progress: 100 } : d)
          );
          
          // Get the public URL using enhanced function
          const { data: urlData } = safeGetPublicUrl(filePath);
          
          if (!urlData.publicUrl) {
            throw new Error("Failed to get public URL");
          }
            
          uploaded++;
          
          const updatedDoc = {
            ...doc,
            status: 'success' as const,
            progress: 100,
            id: data.path,
            url: urlData.publicUrl,
            path: filePath
          };
          
          setDocuments(prev => 
            prev.map((d, i) => i === index ? updatedDoc : d)
          );
          
          return updatedDoc;
        } catch (error) {
          logger.error(`File upload error for document ${index + 1}:`, error);
          failed++;
          
          setDocuments(prev => 
            prev.map((d, i) => i === index ? { ...d, status: 'error' as const } : d)
          );
          
          // Show the error toast
          toast({
            title: "Upload failed",
            description: `Failed to upload ${doc.file.name}. Please try again.`,
            variant: "destructive"
          });
          
          return null;
        }
      });
      
      const results = await Promise.all(uploadPromises);
      successfulDocuments = results.filter(Boolean) as UploadableDocument[];
      
      logger.info(`Document upload complete. Success: ${uploaded}, Failed: ${failed}`);
      
      if (uploaded > 0) {
        toast({
          title: `${uploaded} document${uploaded > 1 ? 's' : ''} uploaded`,
          description: failed > 0 
            ? `${failed} file${failed > 1 ? 's' : ''} failed to upload.` 
            : "All documents uploaded successfully.",
          variant: failed > 0 ? "default" : "default"
        });
      }
      
      return { 
        success: failed === 0,
        uploaded,
        failed,
        documents: successfulDocuments
      };
    } catch (error) {
      logger.error('Document upload error:', error);
      
      toast({
        title: "Upload failed",
        description: "There was a problem with the document upload. Please try again.",
        variant: "destructive"
      });
      
      return { success: false, uploaded, failed: documents.length - uploaded };
    } finally {
      setIsUploading(false);
    }
  };
  
  const clearDocuments = () => {
    setDocuments([]);
  };
  
  return {
    documents,
    isUploading,
    addDocuments,
    removeDocument,
    uploadDocuments,
    clearDocuments,
  };
};
