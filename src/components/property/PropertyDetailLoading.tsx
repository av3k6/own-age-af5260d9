
import React from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyDetailLoading = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Gallery skeleton */}
      <div className="w-full h-96 bg-muted/30 rounded-lg flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="col-span-2 space-y-8">
          {/* Description skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          {/* Features skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        
        <div className="hidden lg:block">
          {/* Information sidebar skeleton */}
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex justify-between mb-4">
              <Skeleton className="h-16 w-16" />
              <Skeleton className="h-16 w-16" />
              <Skeleton className="h-16 w-16" />
            </div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailLoading;
