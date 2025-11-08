
import { calculateScore, calculateDistance, calculateDistanceFactor } from './recommendation';
import { generateFakeProviders } from './pythonService';

// Define district center coordinates with more precise boundaries
const districtCoordinates: Record<string, { 
  lat: number; 
  lng: number; 
  bounds: { 
    north: number; 
    south: number; 
    east: number; 
    west: number 
  } 
}> = {
  'Erode': { 
    lat: 11.3410, 
    lng: 77.7172,
    bounds: {
      north: 11.5266,
      south: 11.1554,
      east: 77.9115,
      west: 77.5229
    }
  },
  'Coimbatore': { 
    lat: 11.0168, 
    lng: 76.9558,
    bounds: {
      north: 11.1693,
      south: 10.8643,
      east: 77.1083,
      west: 76.8033
    }
  },
  'Namakkal': { 
    lat: 11.2342, 
    lng: 78.1673,
    bounds: {
      north: 11.4215,
      south: 11.0469,
      east: 78.3546,
      west: 77.9800
    }
  },
  'Salem': { 
    lat: 11.6643, 
    lng: 78.1460,
    bounds: {
      north: 11.8516,
      south: 11.4770,
      east: 78.3333,
      west: 77.9587
    }
  }
};

// Check if coordinates are within district boundaries
export const isWithinDistrict = (
  lat: number, 
  lng: number, 
  district: string
): boolean => {
  if (!districtCoordinates[district]) return false;
  
  const bounds = districtCoordinates[district].bounds;
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng <= bounds.east &&
    lng >= bounds.west
  );
};

// Find district from coordinates with precision
export const findDistrictFromCoordinates = (
  lat: number,
  lng: number
): string | null => {
  // First check if coordinates are within any district bounds
  for (const [district, coords] of Object.entries(districtCoordinates)) {
    if (isWithinDistrict(lat, lng, district)) {
      return district;
    }
  }
  
  // If not found in bounds, find nearest district center as fallback
  let nearestDistrict = '';
  let shortestDistance = Number.MAX_VALUE;
  
  Object.entries(districtCoordinates).forEach(([district, coords]) => {
    const distance = calculateDistance(
      lat, 
      lng, 
      coords.lat, 
      coords.lng
    );
    
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestDistrict = district;
    }
  });
  
  // Only return if reasonably close (within 30km of center)
  return shortestDistance < 30 ? nearestDistrict : null;
};

// Filter providers by distance from a given location
export const filterProvidersByDistance = (
  providers: any[],
  userLat: number,
  userLng: number,
  maxDistanceKm: number
): any[] => {
  return providers.filter(provider => {
    const distance = calculateDistance(
      userLat, 
      userLng, 
      provider.location.lat, 
      provider.location.lng
    );
    
    provider.distance = distance; // Attach the distance to the provider object
    return distance <= maxDistanceKm;
  });
};

// Get providers in a specific district
export const getProvidersByDistrict = (
  providers: any[],
  district: string
): any[] => {
  return providers.filter(provider => provider.district === district);
};

// Get nearby districts based on district centers
export const getNearbyDistricts = (
  district: string,
  maxDistanceKm: number = 60
): string[] => {
  if (!districtCoordinates[district]) return [];
  
  const baseCoords = districtCoordinates[district];
  const nearby: string[] = [];
  
  Object.entries(districtCoordinates).forEach(([name, coords]) => {
    if (name === district) return; // Skip the same district
    
    const distance = calculateDistance(
      baseCoords.lat, 
      baseCoords.lng, 
      coords.lat, 
      coords.lng
    );
    
    if (distance <= maxDistanceKm) {
      nearby.push(name);
    }
  });
  
  return nearby;
};

// Get all available districts
export const getAvailableDistricts = (): string[] => {
  return Object.keys(districtCoordinates);
};

// Get coordinates for a district
export const getDistrictCoordinates = (district: string): { lat: number; lng: number } | null => {
  return districtCoordinates[district] ? { 
    lat: districtCoordinates[district].lat, 
    lng: districtCoordinates[district].lng 
  } : null;
};

// Get district bounds
export const getDistrictBounds = (district: string): { 
  north: number; 
  south: number; 
  east: number; 
  west: number 
} | null => {
  return districtCoordinates[district]?.bounds || null;
};

// Re-export the generateFakeProviders function
export { generateFakeProviders };
