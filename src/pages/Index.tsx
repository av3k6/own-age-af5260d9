
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

  useEffect(() => {
    // Set a small timeout to ensure content loads properly
    // This helps prevent flickering between loading states
    if (isInitialized) {
      console.log("Auth initialized, preparing to render content");
      const timer = setTimeout(() => {
        setPageReady(true);
        console.log("Page ready state set to true");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Force page ready after a maximum wait time to prevent endless loading
  useEffect(() => {
    const maxWaitTime = setTimeout(() => {
      if (!pageReady) {
        console.log("Maximum wait time reached, forcing page ready");
        setPageReady(true);
        toast({
          title: "Some content may still be loading",
          description: "You can continue browsing while we finish loading everything",
        });
      }
    }, 3000); // 3 seconds maximum wait time
    
    return () => clearTimeout(maxWaitTime);
  }, [pageReady]);

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
    <div className="min-h-screen">
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
