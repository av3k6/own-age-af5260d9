
import { PropertyPhoto } from "@/hooks/edit-listing/usePhotoManagement";
import PhotoItem from "./PhotoItem";
import { ImageIcon } from "lucide-react";

interface PhotoListProps {
  photos: PropertyPhoto[];
  onSetPrimary: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
}

export default function PhotoList({
  photos,
  onSetPrimary,
  onMoveUp,
  onMoveDown,
  onDelete
}: PhotoListProps) {
  if (photos.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-md">
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">No photos added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {photos.map((photo, index) => (
        <PhotoItem
          key={photo.id}
          photo={photo}
          index={index}
          totalPhotos={photos.length}
          onSetPrimary={onSetPrimary}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
