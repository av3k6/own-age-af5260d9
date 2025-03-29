
import React, { useState } from 'react';

interface PropertyImageGalleryProps {
  images: string[];
  title: string;  // Changed from propertyTitle for consistency
}

export default function PropertyImageGallery({ 
  images,
  title
}: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  const handleSelectImage = (image: string) => {
    setSelectedImage(image);
  };

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
            onClick={() => handleSelectImage(image)}
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
