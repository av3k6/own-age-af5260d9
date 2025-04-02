
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface LoginProgressProps {
  isLoading: boolean;
  authProgress: number;
  setAuthProgress: (value: number) => void;
}

export const LoginProgress = ({ isLoading, authProgress, setAuthProgress }: LoginProgressProps) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading && authProgress < 90) {
      interval = setInterval(() => {
        setAuthProgress((prev) => {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        });
      }, 300);
    } else if (!isLoading && authProgress > 0) {
      interval = setInterval(() => {
        setAuthProgress((prev) => {
          if (prev < 100) {
            return Math.min(prev + 10, 100);
          }
          return 0; // Reset after complete
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isLoading, authProgress, setAuthProgress]);

  if (authProgress <= 0) return null;
  
  return <Progress value={authProgress} className="h-1" />;
};
