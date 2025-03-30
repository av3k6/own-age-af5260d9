
import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";

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
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const validateFile = (file: File): { valid: boolean; reason?: string } => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      return { valid: false, reason: `File size exceeds ${maxSizeMB}MB limit` };
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
    
    try {
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
          const filePath = `${customFolder || folder}/${userId ? `${userId}/` : ''}${Date.now()}-${doc.file.name}`;
          
          // Create a manual upload without onUploadProgress
          const { data, error } = await supabase.storage
            .from('storage')
            .upload(filePath, doc.file, {
              cacheControl: '3600',
              upsert: false,
            });
            
          if (error) throw error;
          
          // Simulate upload completed
          setDocuments(prev => 
            prev.map((d, i) => i === index ? { ...d, progress: 100 } : d)
          );
          
          const { data: urlData } = supabase.storage
            .from('storage')
            .getPublicUrl(filePath);
            
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
          console.error('File upload error:', error);
          failed++;
          
          setDocuments(prev => 
            prev.map((d, i) => i === index ? { ...d, status: 'error' as const } : d)
          );
          
          return null;
        }
      });
      
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadableDocument[];
      
      return { 
        success: failed === 0,
        uploaded,
        failed,
        documents: successfulUploads
      };
    } catch (error) {
      console.error('Document upload error:', error);
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
