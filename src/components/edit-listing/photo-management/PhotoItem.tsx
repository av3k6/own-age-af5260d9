
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { PropertyPhoto } from "@/hooks/edit-listing/usePhotoManagement";

interface PhotoItemProps {
  photo: PropertyPhoto;
  index: number;
  totalPhotos: number;
  onSetPrimary: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string) => void;
}

export default function PhotoItem({
  photo,
  index,
  totalPhotos,
  onSetPrimary,
  onMoveUp,
  onMoveDown,
  onDelete
}: PhotoItemProps) {
  return (
    <div
      className={`flex items-center p-3 bg-card border rounded-md ${
        photo.is_primary ? 'border-primary' : ''
      }`}
    >
      <div className="h-16 w-16 mr-4 overflow-hidden rounded-md">
        <img
          src={photo.url}
          alt={`Property photo ${index + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">
          Photo {index + 1}
          {photo.is_primary && (
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Primary
            </span>
          )}
        </p>
      </div>
      <div className="flex space-x-1">
        {!photo.is_primary && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetPrimary(photo.id)}
            title="Set as primary photo"
          >
            Set Primary
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          title="Move up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onMoveDown(index)}
          disabled={index === totalPhotos - 1}
          title="Move down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(photo.id)}
          className="text-destructive"
          title="Delete photo"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
