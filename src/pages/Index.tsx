
import React, { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import FeaturedListings from "@/components/home/FeaturedListings";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import SupabaseStatus from "@/components/auth/SupabaseStatus";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  console.log("Rendering Index/Home component");
  const { isInitialized } = useAuth();
  const [pageReady, setPageReady] = useState(false);
  const { toast } = useToast();

  // Force page to be ready after a short timeout regardless of auth state
  useEffect(() => {
    const forceReadyTimer = setTimeout(() => {
      console.log("Force setting page ready to true");
      setPageReady(true);
    }, 1000); // Reduced from 3000ms to 1000ms
    
    return () => clearTimeout(forceReadyTimer);
  }, []);

  // When auth initializes, set page ready immediately
  useEffect(() => {
    if (isInitialized) {
      console.log("Auth initialized, setting page ready");
      setPageReady(true);
    }
  }, [isInitialized]);

  // Still show loading skeleton if not ready
  if (!pageReady) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero section skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 max-w-lg" />
            <Skeleton className="h-6 w-full max-w-2xl" />
            <div className="h-64 w-full">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          </div>

          {/* Featured listings skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      
      {/* Only visible during development */}
      {import.meta.env.DEV && (
        <div className="container mx-auto px-4 py-8">
          <SupabaseStatus />
        </div>
      )}
    </div>
  );
};

export default Index;
