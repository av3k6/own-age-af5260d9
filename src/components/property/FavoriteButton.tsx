
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/property/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showText?: boolean;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  className,
  size = "icon",
  variant = "ghost",
  showText = false
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavorited = isFavorite(propertyId);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "group",
        className
      )}
      onClick={handleClick}
      aria-label={isFavorited ? "Remove from favourites" : "Add to favourites"}
    >
      <Heart
        className={cn(
          "h-[1.2em] w-[1.2em] transition-colors stroke-[2px]",
          isFavorited 
            ? "fill-red-500 text-red-500" 
            : "fill-transparent text-red-500 group-hover:text-red-500"
        )}
      />
      {showText && (
        <span className="ml-2">
          {isFavorited ? "Favourited" : "Favourite"}
        </span>
      )}
    </Button>
  );
};

export default FavoriteButton;
