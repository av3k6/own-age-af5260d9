
import React from "react";

const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <p className="text-lg font-medium text-gray-500">Loading property data...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
