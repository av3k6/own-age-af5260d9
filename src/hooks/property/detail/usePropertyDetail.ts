
import { useState, useEffect } from "react";
import { PropertyListing } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { createLogger } from "@/utils/logger";
import { useFetchMockProperty } from "./useFetchMockProperty";
import { useFetchDatabaseProperty } from "./useFetchDatabaseProperty";

const logger = createLogger("usePropertyDetail");

export const usePropertyDetail = (propertyId: string | undefined) => {
  const [property, setProperty] = useState<PropertyListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'not-found' | 'invalid-id' | 'no-permission' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { fetchMockProperty } = useFetchMockProperty(user);
  const { fetchDatabaseProperty } = useFetchDatabaseProperty(user);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setErrorType('not-found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // First try to fetch from mock data
        const { mockProperty, mockErrorType } = await fetchMockProperty(propertyId);
        
        if (mockProperty) {
          logger.info("Found property in mock data:", { id: propertyId, title: mockProperty.title });
          setProperty(mockProperty);
          setIsLoading(false);
          return;
        }
        
        if (mockErrorType) {
          setErrorType(mockErrorType);
          setProperty(null);
          setIsLoading(false);
          return;
        }
        
        // If not found in mock data, try to fetch from Supabase
        const { dbProperty, dbErrorType } = await fetchDatabaseProperty(propertyId);
        
        if (dbProperty) {
          setProperty(dbProperty);
        } else {
          setErrorType(dbErrorType || 'not-found');
          setProperty(null);
        }
      } catch (err) {
        logger.error("Failed to fetch property:", err);
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
        setProperty(null);
        setErrorType('not-found');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [propertyId, toast, user, fetchMockProperty, fetchDatabaseProperty]);

  return {
    property,
    isLoading,
    errorType
  };
};
