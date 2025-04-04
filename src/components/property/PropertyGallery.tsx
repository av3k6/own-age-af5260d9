
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from '@/components/ui/button';

interface PropertyGalleryProps {
  images: string[];
}

const PropertyGallery = ({ images }: PropertyGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullScreen, setShowFullScreen] = useState(false);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFullScreen = () => {
    setShowFullScreen(!showFullScreen);
  };

  if (images.length === 0) {
    return (
      <div className="bg-muted h-96 flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-lg overflow-hidden">
        {/* Main Image */}
        <div 
          className="aspect-[16/9] bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
          onClick={toggleFullScreen}
        />

        {/* Navigation controls */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-black/30 hover:bg-black/50 text-white rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
        {images.slice(0, 6).map((image, index) => (
          <div 
            key={index}
            className={`aspect-[4/3] bg-cover bg-center rounded cursor-pointer border-2 ${
              index === currentImageIndex ? "border-primary" : "border-transparent"
            }`}
            style={{ backgroundImage: `url(${image})` }}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
      
      {/* Full screen modal */}
      {showFullScreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col" onClick={toggleFullScreen}>
          <div className="flex justify-between items-center p-4">
            <span className="text-white">{currentImageIndex + 1} of {images.length}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full"
              onClick={toggleFullScreen}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4">
            <img 
              src={images[currentImageIndex]} 
              alt={`Property image ${currentImageIndex + 1}`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <div className="flex justify-center p-4 gap-4">
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyGallery;
