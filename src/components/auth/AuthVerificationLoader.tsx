
import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { LucideIcon, UserCheck, Database, Bot, Key, Shield, RefreshCcw } from "lucide-react";

interface AuthVerificationLoaderProps {
  isVerifying: boolean;
}

interface VerificationStep {
  id: string;
  label: string;
  icon: LucideIcon;
  completed: boolean;
}

const AuthVerificationLoader = ({ isVerifying }: AuthVerificationLoaderProps) => {
  const [authVerificationProgress, setAuthVerificationProgress] = useState(10);
  const [verificationTime, setVerificationTime] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define verification steps that explain what's happening
  const [steps, setSteps] = useState<VerificationStep[]>([
    { id: 'token', label: 'Validating security tokens', icon: Key, completed: false },
    { id: 'session', label: 'Establishing secure session', icon: Shield, completed: false },
    { id: 'user', label: 'Retrieving user profile', icon: UserCheck, completed: false },
    { id: 'preferences', label: 'Loading your preferences', icon: Database, completed: false },
    { id: 'finalizing', label: 'Finalizing authentication', icon: RefreshCcw, completed: false }
  ]);
  
  // Handle progress animation for verification and step completion
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isVerifying) {
      const startTime = Date.now();
      let lastStepTime = startTime;
      
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setVerificationTime(elapsed);
        
        // Cap the progress at 70% while verifying
        const calculatedProgress = Math.min(70, (elapsed / 2000) * 70);
        setAuthVerificationProgress(calculatedProgress);
        
        // Simulate steps completion based on time
        const currentTimeElapsed = Date.now() - lastStepTime;
        if (currentTimeElapsed > 800 && currentStep < steps.length) {
          setSteps(prev => {
            const updated = [...prev];
            if (currentStep < updated.length) {
              updated[currentStep].completed = true;
            }
            return updated;
          });
          setCurrentStep(prev => Math.min(prev + 1, steps.length));
          lastStepTime = Date.now();
        }
        
        // If taking too long (> 5 seconds), show slow connection message via progress color
        if (elapsed > 5000 && authVerificationProgress < 70) {
          setAuthVerificationProgress(prev => Math.min(prev + 1, 70));
        }
      }, 100);
    } else {
      // Complete all steps and progress quickly once verification is done
      setSteps(prev => prev.map(step => ({ ...step, completed: true })));
      
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
  }, [isVerifying, currentStep, steps.length]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-lg font-medium mb-1">Verifying your account...</p>
      
      {/* Progress indicators */}
      <div className="w-64 mt-4">
        <Progress 
          value={authVerificationProgress} 
          className={`h-2 ${verificationTime > 5000 ? 'bg-orange-100' : ''}`} 
        />
      </div>
      
      {/* Verification steps with icons */}
      <div className="mt-6 space-y-3 w-64">
        {steps.map((step, index) => (
          <div key={step.id} className={`flex items-center opacity-${index <= currentStep ? '100' : '50'}`}>
            <div className={`mr-3 p-1 rounded-full ${step.completed ? 'text-green-500' : 'text-muted-foreground'}`}>
              <step.icon size={18} />
            </div>
            <span className={`text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      {verificationTime > 3000 && (
        <p className="text-xs text-muted-foreground mt-4 max-w-xs text-center">
          This is taking longer than usual. We're checking your credentials with the authentication server. 
          This may happen if the server is experiencing high traffic.
        </p>
      )}
    </div>
  );
};

export default AuthVerificationLoader;
