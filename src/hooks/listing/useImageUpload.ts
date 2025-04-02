
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

export const useImageUpload = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const uploadImages = async (images: File[], userId: string): Promise<string[]> => {
    if (!images.length) return [];
    
    const imageUrls: string[] = [];
    const defaultBucket = 'storage';
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const fileName = `${userId}-${Date.now()}-${i}`;
      const folderPath = `${userId}/property-images`;
      
      try {
        // Upload the image to the default bucket
        const { data, error } = await supabase.storage
          .from(defaultBucket)
          .upload(`${folderPath}/${fileName}`, image);

        if (error) throw error;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from(defaultBucket)
          .getPublicUrl(`${folderPath}/${fileName}`);
        
        imageUrls.push(urlData.publicUrl);
        
        console.log(`Successfully uploaded image ${i+1}:`, urlData.publicUrl);
      } catch (uploadError: any) {
        console.error('Image upload error:', uploadError);
        toast({
          title: "Upload Warning",
          description: `Failed to upload image ${i+1}. Continuing with other images.`,
          variant: "destructive",
        });
      }
    }
    
    return imageUrls;
  };

  return { uploadImages };
};
