
import { usePhotoManagement } from "@/hooks/edit-listing/usePhotoManagement";
import { Button } from "@/components/ui/button";
import { Loader2, GripVertical, ImageDown } from "lucide-react";
import PhotoList from "./PhotoList";
import { FileUploader } from "@/components/ui/file-uploader";
import { toast } from "@/hooks/use-toast";
import { createLogger } from "@/utils/logger";
import { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const logger = createLogger("PhotoManagementTab");

interface PhotoManagementTabProps {
  propertyId: string | undefined;
}

export default function PhotoManagementTab({ propertyId }: PhotoManagementTabProps) {
  const {
    photos,
    isLoading,
    isUploading,
    uploadPhotos,
    deletePhoto,
    movePhotoUp,
    movePhotoDown,
    setPrimaryPhoto,
    reorderPhotos
  } = usePhotoManagement(propertyId);

  const handleFileUpload = async (files: File[]): Promise<boolean> => {
    logger.info("Handling file upload for", files.length, "files");
    
    if (!propertyId) {
      logger.error("No propertyId provided");
      toast({
        title: "Error",
        description: "Property ID is missing. Please try again later.",
        variant: "destructive",
      });
      return false;
    }

    if (files.length === 0) {
      logger.info("No files to upload");
      return false;
    }
    
    try {
      const success = await uploadPhotos(files);
      logger.info("Upload result:", success);
      return success;
    } catch (error) {
      logger.error("Error handling upload:", error);
      toast({
        title: "Upload Error",
        description: "Failed to process photos. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return; // Dropped outside list
    
    const startIndex = result.source.index;
    const endIndex = result.destination.index;
    
    if (startIndex === endIndex) return; // No movement
    
    // Call the reorder function from the hook
    await reorderPhotos(startIndex, endIndex);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Property Photos</h2>
          <p className="text-muted-foreground">
            Add, remove, or reorder photos of your property
          </p>
        </div>
      </div>

      <FileUploader
        accept="image/*"
        multiple
        maxFiles={10}
        maxSize={5 * 1024 * 1024} // 5MB
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />
      
      <p className="text-xs text-muted-foreground mt-2">
        Supported formats: JPG, PNG, WebP. Max size: 5MB per image.
      </p>

      {photos.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-md">
            <p className="text-sm mb-2"><strong>Tips:</strong></p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Set your best photo as the primary (featured) image</li>
              <li>You can reorder photos by dragging or using the up/down buttons</li>
              <li>Changes to photo order are saved automatically</li>
            </ul>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="photos-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {photos.map((photo, index) => (
                    <Draggable key={photo.id} draggableId={photo.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center p-3 bg-card border rounded-md ${
                            photo.is_primary ? 'border-primary' : ''
                          }`}
                        >
                          <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
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
                                onClick={() => setPrimaryPhoto(photo.id)}
                                title="Set as primary photo"
                              >
                                Set Primary
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => movePhotoUp(index)}
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
                              onClick={() => movePhotoDown(index)}
                              disabled={index === photos.length - 1}
                              title="Move down"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="m6 9 6 6 6-6"/>
                              </svg>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deletePhoto(photo.id)}
                              className="text-destructive"
                              title="Delete photo"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/30 rounded-md">
          <ImageDown className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No photos added yet.</p>
          <p className="text-sm text-muted-foreground">Upload photos above to get started.</p>
        </div>
      )}
    </div>
  );
}
