
import React, { createContext, useContext, useState, useEffect } from 'react';
import { findDistrictFromCoordinates } from '@/utils/providers';

type Coordinates = {
  lat: number;
  lng: number;
};

type LocationStatus = 
  | 'idle' 
  | 'detecting' 
  | 'success' 
  | 'error' 
  | 'permission-denied'
  | 'unavailable'
  | 'timeout';

type MapContextType = {
  ready: boolean;
  error: Error | null;
  userLocation: Coordinates | null;
  userDistrict: string | null;
  locationStatus: LocationStatus;
  detectUserLocation: () => Promise<Coordinates | null>;
};

const MapContext = createContext<MapContextType>({
  ready: true,
  error: null,
  userLocation: null,
  userDistrict: null,
  locationStatus: 'idle',
  detectUserLocation: async () => null
});

export const useMapContext = () => useContext(MapContext);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Our mock map is always ready, no external loading or API keys needed
  const [ready] = useState(true);
  const [error] = useState<Error | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [userDistrict, setUserDistrict] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');
  
  // Function to detect user location
  const detectUserLocation = async (): Promise<Coordinates | null> => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return null;
    }
    
    setLocationStatus('detecting');
    
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(coords);
          
          // Find the district based on coordinates
          const district = findDistrictFromCoordinates(coords.lat, coords.lng);
          setUserDistrict(district);
          
          setLocationStatus('success');
          resolve(coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
          
          if (error.code === 1) {
            setLocationStatus('permission-denied');
          } else if (error.code === 2) {
            setLocationStatus('unavailable');
          } else if (error.code === 3) {
            setLocationStatus('timeout');
          } else {
            setLocationStatus('error');
          }
          
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };
  
  // Try to detect location on initial load
  useEffect(() => {
    // Don't auto-detect on initial load, let user trigger it
    // This avoids unwanted permission prompts
    
    // Cleanup
    return () => {
      // No cleanup needed for geolocation
    };
  }, []);
  
  return (
    <MapContext.Provider value={{ 
      ready, 
      error, 
      userLocation, 
      userDistrict, 
      locationStatus,
      detectUserLocation 
    }}>
      {children}
    </MapContext.Provider>
  );
};
