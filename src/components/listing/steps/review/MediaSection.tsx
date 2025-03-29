
import { Image } from "lucide-react";
import { useFormContext } from "../../context/FormContext";

const MediaSection = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Photos</h3>
      {formData.imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {formData.imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                className="w-full h-24 object-cover rounded-md"
              />
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-xs py-1 text-center">
                  Primary Photo
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-muted/50 rounded-md flex items-center gap-3">
          <Image className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground italic">No photos uploaded</p>
        </div>
      )}
    </div>
  );
};

export default MediaSection;
