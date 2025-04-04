
import React, { useState } from 'react';

interface PropertyGalleryProps {
  images: string[];
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  if (images.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
        <img
          src={selectedImage}
          alt="Property"
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
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`Property view ${index + 1}`}
              className="w-full h-20 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;
