
import React from "react";

interface FormProgressProps {
  currentStep: string;
  steps: {
    id: string;
    title: string;
    position: number;
  }[];
}

const FormProgress = ({ currentStep, steps }: FormProgressProps) => {
  const currentPosition = steps.find(step => step.id === currentStep)?.position || 1;
  const totalSteps = steps.length;
  const percentage = (currentPosition / totalSteps) * 100;
  
  return (
    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-foreground">
          {steps.find(step => step.id === currentStep)?.title}
        </h2>
        <div className="text-sm text-muted-foreground">
          Step {currentPosition} of {totalSteps}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 mt-4 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FormProgress;
