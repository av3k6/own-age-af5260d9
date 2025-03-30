
import { useRef, useState } from 'react';

interface UseFileDragDropProps {
  onFilesDrop: (files: FileList) => void;
}

export const useFileDragDrop = ({ onFilesDrop }: UseFileDragDropProps) => {
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave' || e.type === 'drop') {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files?.length) {
      onFilesDrop(e.dataTransfer.files);
    }
  };
  
  return {
    dropAreaRef,
    isDragging,
    handleDragEvent,
    handleDrop
  };
};
