
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useProvinceLocation = () => {
  const [province, setProvince] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const detectUserProvince = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First check if we have a stored province in localStorage
        const storedProvince = localStorage.getItem('selectedProvince');
        if (storedProvince) {
          setProvince(storedProvince);
          setLoading(false);
          return;
        }
        
        // Only try to use geolocation if we don't have a stored province
        // Create a promise that will resolve with position or reject after timeout
        const positionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
          // Set a timeout for geolocation request
          const timeoutId = setTimeout(() => {
            reject(new Error('Geolocation timed out'));
          }, 3000);
          
          // Try to get the user's position
          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (err) => {
              clearTimeout(timeoutId);
              reject(err);
            }
          );
        });
        
        // Wait for position with timeout
        const position = await positionPromise;
        
        // Now that we have position, try reverse geocoding with timeout
        const reverseGeocodePromise = fetch(
          `https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
        );
        
        // Set a timeout for the geocoding request
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Geocoding timed out')), 3000)
        );
        
        const response = await Promise.race([reverseGeocodePromise, timeoutPromise]);
        
        if (response instanceof Response && response.ok) {
          const data = await response.json();
          const detectedProvince = data.address?.state || null;
          
          if (detectedProvince) {
            setProvince(detectedProvince);
            localStorage.setItem('selectedProvince', detectedProvince);
          } else {
            // If we couldn't detect a province, default to a fallback
            setProvince('all');
            localStorage.setItem('selectedProvince', 'all');
          }
        } else {
          // If geocoding failed, use fallback
          setProvince('all');
          localStorage.setItem('selectedProvince', 'all');
        }
      } catch (err) {
        // Silently handle the error and use a fallback
        console.error("Error detecting province:", err);
        setProvince('all');
        localStorage.setItem('selectedProvince', 'all');
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    detectUserProvince();
  }, []);
  
  return { province, loading, error, setProvince };
};
