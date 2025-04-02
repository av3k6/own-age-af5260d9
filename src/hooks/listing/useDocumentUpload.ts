
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

export interface DocumentMetadata {
  name: string;
  type: string;
  size: number;
  url: string;
}

export const useDocumentUpload = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const uploadDocuments = async (documents: File[], userId: string): Promise<DocumentMetadata[]> => {
    if (!documents.length) return [];
    
    const documentData: DocumentMetadata[] = [];
    const defaultBucket = 'storage';
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const fileName = `${userId}-${Date.now()}-${i}-${doc.name}`;
      const folderPath = `${userId}/documents`;
      
      try {
        const { data, error } = await supabase.storage
          .from(defaultBucket)
          .upload(`${folderPath}/${fileName}`, doc);

        if (error) throw error;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from(defaultBucket)
          .getPublicUrl(`${folderPath}/${fileName}`);
        
        documentData.push({
          name: doc.name,
          type: doc.type,
          size: doc.size,
          url: urlData.publicUrl
        });
      } catch (uploadError: any) {
        console.error('Document upload error:', uploadError);
        // Continue with other documents
      }
    }
    
    return documentData;
  };

  return { uploadDocuments };
};
