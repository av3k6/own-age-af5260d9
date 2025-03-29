
interface PropertyImageGalleryProps {
  images: string[];
  selectedImage: string;
  onSelectImage: (image: string) => void;
  title: string;
}

export default function PropertyImageGallery({ 
  images, 
  selectedImage, 
  onSelectImage,
  title 
}: PropertyImageGalleryProps) {
  return (
    <>
      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-[400px] object-cover"
        />
      </div>
      
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer rounded-md overflow-hidden border-2 ${
              selectedImage === image
                ? "border-zen-blue-500"
                : "border-transparent"
            }`}
            onClick={() => onSelectImage(image)}
          >
            <img
              src={image}
              alt={`${title} - view ${index + 1}`}
              className="w-full h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
