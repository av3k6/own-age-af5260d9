import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import { useFormContext } from "../context/FormContext";

const MediaUpload = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Create temporary URLs for preview
    const newImages = [...formData.images, ...imageFiles];
    const newImageUrls = newImages.map(file => URL.createObjectURL(file));
    
    updateFormData({ 
      images: newImages,
      imageUrls: newImageUrls
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    const newImageUrls = [...formData.imageUrls];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImageUrls[index]);
    
    newImages.splice(index, 1);
    newImageUrls.splice(index, 1);
    
    updateFormData({ 
      images: newImages,
      imageUrls: newImageUrls
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center p-4 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <div className="text-lg font-medium">Upload Property Photos</div>
          <p className="text-muted-foreground">
            Drag and drop your images here, or click to browse
          </p>
          <Button type="button" variant="outline" className="mt-4" onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}>
            <Upload className="h-4 w-4 mr-2" />
            Select Images
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Tip: High-quality photos increase buyer interest. Add images of all rooms, exterior, and special features.
          </p>
        </div>

        {formData.imageUrls.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Selected Photos ({formData.imageUrls.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.imageUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs py-1 text-center">
                      Primary Photo
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button type="submit" disabled={formData.images.length === 0}>
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default MediaUpload;
