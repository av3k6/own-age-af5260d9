
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/components/ui/use-toast";
import { Attachment } from "@/types/message";

export function useAttachmentUpload() {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const uploadAttachments = async (conversationId: string, files: File[]): Promise<Attachment[]> => {
    const attachments: Attachment[] = [];
    
    for (const file of files) {
      try {
        const filePath = `messages/${conversationId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);
          
        if (error) throw error;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);
          
        attachments.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
        });
      } catch (uploadError) {
        console.error("Error uploading attachment:", uploadError);
        toast({
          title: "Upload error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
    
    return attachments;
  };

  return { uploadAttachments };
}
