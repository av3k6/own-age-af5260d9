
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";

interface AuthVerificationLoaderProps {
  isVerifying: boolean;
}

const AuthVerificationLoader = ({ isVerifying }: AuthVerificationLoaderProps) => {
  const [authVerificationProgress, setAuthVerificationProgress] = useState(10);
  const [verificationTime, setVerificationTime] = useState(0);
  
  // Handle progress animation for verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVerifying) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setVerificationTime(elapsed);
        
        // Cap the progress at 70% while verifying
        const calculatedProgress = Math.min(70, (elapsed / 2000) * 70);
        setAuthVerificationProgress(calculatedProgress);
        
        // If taking too long (> 5 seconds), show slow connection message via progress color
        if (elapsed > 5000 && authVerificationProgress < 70) {
          setAuthVerificationProgress(prev => Math.min(prev + 1, 70));
        }
      }, 100);
    } else {
      // Complete the progress quickly once verification is done
      interval = setInterval(() => {
        setAuthVerificationProgress(prev => {
          if (prev < 100) return Math.min(prev + 10, 100);
          clearInterval(interval);
          return prev;
        });
      }, 30);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVerifying]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground mb-1">Verifying your account...</p>
      
      {verificationTime > 3000 && (
        <p className="text-xs text-muted-foreground mb-4">
          This is taking longer than usual. Please wait...
        </p>
      )}
      
      <div className="w-64 mt-2">
        <Progress 
          value={authVerificationProgress} 
          className={`h-2 ${verificationTime > 5000 ? 'bg-orange-100' : ''}`} 
        />
      </div>
    </div>
  );
};

export default AuthVerificationLoader;
