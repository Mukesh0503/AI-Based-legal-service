
// Export calculation functions first to avoid circular dependencies
export const calculateScore = (
  rating: number,
  verified: number,
  categoryMatch: number,
  distanceFactor: number
): number => {
  const weights = {
    rating: 0.4,
    verified: 0.3,
    categoryMatch: 0.2,
    distanceFactor: 0.1
  };

  const score = (
    (rating * weights.rating) + 
    (verified * weights.verified) + 
    (categoryMatch * weights.categoryMatch) + 
    (distanceFactor * weights.distanceFactor)
  );

  return Math.round(score * 10) / 10;
};

export const calculateDistanceFactor = (distanceKm: number, maxDistanceKm: number = 60): number => {
  if (distanceKm <= 0) return 1.0;
  if (distanceKm >= maxDistanceKm) return 0.0;
  
  if (distanceKm <= 10) return 1.0;
  if (distanceKm <= 20) return 0.8;
  if (distanceKm <= 40) return 0.5;
  return 0.2; // 40-60km
};

export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// Import the functions from pythonService.ts AFTER defining our calculation functions
// This prevents the circular dependency issue
import { rewardProvider, getProviderReward, getClusteredRecommendations, trackUserInteraction } from './pythonService';

// Re-export the reinforcement learning functions
export { rewardProvider, getProviderReward, trackUserInteraction };

// Export the cluster-based recommendation function
export { getClusteredRecommendations };

// Enhanced function to generate fuzzy logic badges
export const generateProviderBadges = (
  provider: any
): string[] => {
  const badges: string[] = [];
  
  // Highly Recommended badge
  if (provider.score > 4.5) {
    badges.push("Highly Recommended");
  }
  
  // Fast & Trusted badge
  if (provider.responseTime < 5) {
    badges.push("Fast & Trusted");
  }
  
  // New Provider badge
  if (provider.rating < 3.5 || provider.experience < 1) {
    badges.push("New Provider");
  }
  
  // Trusted Advisor badge
  if (provider.verified && provider.experience > 10) {
    badges.push("Trusted Advisor");
  }
  
  // Popular choice badge
  if (provider.bookingCount && provider.bookingCount > 10) {
    badges.push("Popular Choice");
  }
  
  // High Availability badge
  if (provider.availableSlots && provider.availableSlots > 5) {
    badges.push("High Availability");
  }
  
  return badges;
};
