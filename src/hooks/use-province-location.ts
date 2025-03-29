
import { useState, useEffect } from 'react';
import { findProvinceByLocation } from '@/utils/provinceData';

interface UseProvinceLocationOptions {
  onLocationDetected?: (province: string) => void;
}

export function useProvinceLocation(options?: UseProvinceLocationOptions) {
  const [detectedProvince, setDetectedProvince] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const detectUserProvince = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if browser supports geolocation
        if (!navigator.geolocation) {
          throw new Error("Geolocation is not supported by your browser");
        }
        
        // Get user's coordinates
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude, longitude } = position.coords;
        
        // Use reverse geocoding to get province/state
        const response = await fetch(
          `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }
        
        const data = await response.json();
        console.log("Geocoding response:", data);
        
        // Extract province data
        const stateCode = data.address?.state_code || data.address?.['ISO3166-2-lvl4']?.split('-')[1];
        const stateName = data.address?.state;
        
        // Find matching province
        const province = findProvinceByLocation(stateCode, stateName);
        
        // Set and return detected province
        setDetectedProvince(province);
        if (options?.onLocationDetected) {
          options.onLocationDetected(province);
        }
      } catch (err) {
        console.error("Error detecting province:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    detectUserProvince();
  }, [options]);

  return {
    detectedProvince,
    isLoading,
    error
  };
}
