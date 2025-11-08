
// This file simulates calling Python backend services locally
// In a real app, these would be API calls to a Python backend

// Define score calculation function directly here to avoid circular dependencies
const calculateProviderScore = (
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

// Store the provider data locally for the mock service
let providers = [] as any[];
const providerRewards: Record<string, number> = {};
const userInteractions: Record<string, any> = {};
const bookingHistory: Record<string, any[]> = {};

// Generate fake provider data for the mock service
const initializeProviders = (count: number = 100) => {
  // Provider generation code moved here to avoid circular dependencies
  
  // Define district center coordinates
  const districtCoordinates: Record<string, { lat: number; lng: number }> = {
    'Erode': { lat: 11.3410, lng: 77.7172 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Namakkal': { lat: 11.2342, lng: 78.1673 },
    'Salem': { lat: 11.6643, lng: 78.1460 }
  };
  
  // Legal categories
  const legalCategories = [
    'Criminal Law',
    'Family Law',
    'Property Law',
    'Civil Law',
    'Taxation'
  ];
  
  // Tamil style names for generating fake providers
  const tamilFirstNames = [
    'Karthik', 'Ramesh', 'Suresh', 'Mahesh', 'Ganesh', 'Rajesh', 'Dinesh',
    'Venkatesh', 'Prakash', 'Arun', 'Vijay', 'Kumar', 'Sundaram', 'Rajan',
    'Mohan', 'Gopal', 'Sundar', 'Anand', 'Sathish', 'Senthil', 'Murugan',
    'Lakshmi', 'Priya', 'Saranya', 'Divya', 'Kalpana', 'Kavitha', 'Meena',
    'Sumathi', 'Geetha', 'Uma', 'Anitha', 'Radha', 'Saraswathi', 'Shanti'
  ];
  
  const tamilLastNames = [
    'Selvan', 'Kumar', 'Raman', 'Pillai', 'Naidu', 'Iyer', 'Iyengar',
    'Mudaliar', 'Gounder', 'Chettiar', 'Nadar', 'Thevar', 'Pandian',
    'Krishnan', 'Subramanian', 'Chandran', 'Balasubramanian', 'Sundaram',
    'Natarajan', 'Venkataraman', 'Devi', 'Murthy', 'Raj', 'Muthusamy'
  ];
  
  // Generate a random Tamil-style name
  const generateTamilName = (): string => {
    const firstName = tamilFirstNames[Math.floor(Math.random() * tamilFirstNames.length)];
    const lastName = tamilLastNames[Math.floor(Math.random() * tamilLastNames.length)];
    return `${firstName} ${lastName}`;
  };
  
  // Generate a random location within a radius from district center
  const generateRandomLocation = (district: string, radiusKm: number = 10) => {
    const center = districtCoordinates[district];
    if (!center) return districtCoordinates['Erode']; // Default
    
    // Earth's radius in km
    const earthRadius = 6371;
    
    // Convert radius from km to degrees (approximate)
    const radiusInDegrees = radiusKm / earthRadius;
    
    // Random angle
    const angle = Math.random() * 2 * Math.PI;
    
    // Random distance within radius
    const distance = Math.random() * radiusInDegrees;
    
    // Calculate offset
    const latOffset = distance * Math.cos(angle);
    const lngOffset = distance * Math.sin(angle) / Math.cos(center.lat * Math.PI / 180);
    
    return {
      lat: center.lat + latOffset * (180 / Math.PI),
      lng: center.lng + lngOffset * (180 / Math.PI)
    };
  };
  
  // Generate fake address segments for Tamil Nadu
  const generateFakeAddress = (district: string): string => {
    const streetNumbers = ["123", "45", "67", "89", "12", "34", "56", "78", "90"];
    const streetNames = [
      "Gandhi Road", "Nehru Street", "Kamaraj Avenue", "Anna Salai", 
      "Periyar Road", "Temple Street", "Market Road", "College Road",
      "Station Road", "Main Street", "Bharathiyar Road"
    ];
    const areas = [
      "Shevapet", "Hasthampatti", "Fairlands", "Alagapuram", "Kondalampatti",
      "R.S. Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony", "Singanallur",
      "Erode Central", "Surampatti", "Sathyamangalam Road", "Solar",
      "Namakkal Town", "Rasipuram", "Tiruchengode", "Paramathi Velur"
    ];
  
    const streetNumber = streetNumbers[Math.floor(Math.random() * streetNumbers.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
  
    return `${streetNumber} ${streetName}, ${area}, ${district}`;
  };
  
  // Generate a single fake legal provider
  const generateFakeProvider = (id: string, district?: string): any => {
    // Select random district if not provided
    const selectedDistrict = district || 
      Object.keys(districtCoordinates)[Math.floor(Math.random() * Object.keys(districtCoordinates).length)];
    
    const category = legalCategories[Math.floor(Math.random() * legalCategories.length)];
    const rating = parseFloat((3 + Math.random() * 2).toFixed(1)); // Rating between 3.0 and 5.0
    const experience = Math.floor(1 + Math.random() * 20); // 1-20 years
    const verified = Math.random() > 0.3; // 70% are verified
    const location = generateRandomLocation(selectedDistrict);
    const responseTime = Math.floor(1 + Math.random() * 24); // 1-24 hours
    
    const provider = {
      id,
      name: generateTamilName(),
      category,
      district: selectedDistrict,
      address: generateFakeAddress(selectedDistrict),
      rating,
      experience,
      verified,
      languages: ['Tamil', 'English'],
      location,
      responseTime,
      availableSlots: Math.floor(Math.random() * 10) // Random number of available slots
    };
    
    // Pre-calculate the score for convenience using local function
    provider['score'] = calculateProviderScore(
      rating,
      verified ? 1 : 0,
      1, // assume category match
      0.8 // assume reasonable distance
    );
    
    return provider;
  };

  const generatedProviders: any[] = [];
  const districts = Object.keys(districtCoordinates);
  
  // Ensure each district has at least count/4 providers
  const providersPerDistrict = Math.ceil(count / districts.length);
  
  districts.forEach((district) => {
    for (let i = 0; i < providersPerDistrict; i++) {
      // Generate a unique ID for this provider
      const id = `provider_${district.toLowerCase()}_${i}`;
      generatedProviders.push(generateFakeProvider(id, district));
    }
  });
  
  // Shuffle the array to randomize the order
  return generatedProviders.sort(() => Math.random() - 0.5);
};

// Initialize providers at module load time
providers = initializeProviders(100);

// Export the function to generate providers for other modules that need it directly
export const generateFakeProviders = (count: number = 20): any[] => {
  return initializeProviders(count);
};

// After defining our functions, import what we need from recommendation.ts
import { calculateDistance } from './recommendation';

// Simulated API endpoints to Python recommendation service
export const pythonService = {
  // Initialize the recommendation engine with providers
  initialize: async () => {
    console.log("Initializing recommendation engine with providers");
    
    // Simulate Python backend processing
    // Add reinforcement learning rewards
    providers = providers.map(provider => ({
      ...provider,
      rl_reward: providerRewards[provider.id] || 0
    }));
    
    // Assign random clusters to simulate K-means clustering
    const clusters = [0, 1, 2, 3]; // 4 clusters
    providers = providers.map(provider => ({
      ...provider,
      cluster: clusters[Math.floor(Math.random() * clusters.length)]
    }));
    
    return {
      status: "success",
      message: "Recommendation engine initialized"
    };
  },
  
  // Get recommendations based on user preferences
  getRecommendations: async (userPreferences: any = {}) => {
    console.log("Getting recommendations with preferences:", userPreferences);
    
    // Filter and score providers
    let filtered = [...providers];
    
    // Filter by user preferences
    if (userPreferences.district) {
      filtered = filtered.filter(p => p.district === userPreferences.district);
    }
    
    if (userPreferences.category && userPreferences.category !== 'all-categories') {
      filtered = filtered.filter(p => p.category === userPreferences.category);
    }
    
    if (userPreferences.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= userPreferences.minRating);
    }
    
    if (userPreferences.minExperience > 0) {
      filtered = filtered.filter(p => p.experience >= userPreferences.minExperience);
    }
    
    // Calculate AI-driven scores for each provider
    filtered = filtered.map(provider => {
      // Base scoring factors
      const ratingFactor = provider.rating * 0.4;
      const verifiedFactor = provider.verified ? 0.3 : 0;
      const categoryFactor = (userPreferences.category && 
        provider.category === userPreferences.category) ? 0.2 : 0.1;
      
      // Calculate proximity factor
      let proximityFactor = 0.1;
      if (provider.distance !== undefined) {
        if (provider.distance <= 10) proximityFactor = 0.1;
        else if (provider.distance <= 20) proximityFactor = 0.08;
        else if (provider.distance <= 40) proximityFactor = 0.05;
        else proximityFactor = 0.02;
      }
      
      // Apply reinforcement learning reward
      const rlReward = providerRewards[provider.id] || 0;
      
      // Calculate final score
      const score = ratingFactor + verifiedFactor + categoryFactor + proximityFactor + rlReward;
      
      // Apply fuzzy logic badges
      const badges = [];
      if (score > 4.5) badges.push("Highly Recommended");
      if (provider.responseTime < 5) badges.push("Fast & Trusted");
      if (provider.rating < 3.5 || provider.experience < 1) badges.push("New Provider");
      if (provider.verified && provider.experience > 10) badges.push("Trusted Advisor");
      
      return {
        ...provider,
        score: Math.round(score * 10) / 10,
        badges
      };
    });
    
    // Sort by scores (descending)
    filtered.sort((a, b) => b.score - a.score);
    
    return {
      recommendations: filtered
    };
  },
  
  // Get similar providers to the given one
  getSimilarProviders: async (providerId: string) => {
    console.log("Finding similar providers to:", providerId);
    
    // Find the target provider
    const targetProvider = providers.find(p => p.id === providerId);
    if (!targetProvider) {
      return { similar_providers: [] };
    }
    
    // Find providers with similar attributes
    const similar = providers
      .filter(p => p.id !== providerId)
      .map(provider => {
        let similarity = 0;
        
        // Same category is important
        if (provider.category === targetProvider.category) {
          similarity += 3;
        }
        
        // Same district is somewhat important
        if (provider.district === targetProvider.district) {
          similarity += 2;
        }
        
        // Rating within 0.5 point
        if (Math.abs(provider.rating - targetProvider.rating) <= 0.5) {
          similarity += 1;
        }
        
        return {
          provider,
          similarity
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .map(item => item.provider)
      .slice(0, 5);
    
    return {
      similar_providers: similar
    };
  },
  
  // Update the reinforcement learning reward for a provider
  updateReward: async (providerId: string, reward: number = 0.05) => {
    console.log(`Updating RL reward for provider ${providerId} by ${reward}`);
    
    // Update or initialize the reward value
    providerRewards[providerId] = (providerRewards[providerId] || 0) + reward;
    
    return {
      status: "success",
      message: `Updated RL reward for provider ${providerId}`
    };
  },
  
  // Track user interactions for personalization
  trackUserInteraction: async (userId: string, interactionType: string, interactionData: any = {}) => {
    console.log(`Tracking ${interactionType} for user ${userId}`);
    
    // Initialize user data if needed
    if (!userInteractions[userId]) {
      userInteractions[userId] = {
        categoryPreferences: {},
        districtPreferences: {},
        viewedProviders: [],
        interactionHistory: []
      };
    }
    
    // Record the interaction
    userInteractions[userId].interactionHistory.push({
      type: interactionType,
      data: interactionData,
      timestamp: new Date().toISOString()
    });
    
    // Update specific preferences based on interaction type
    if (interactionType === 'view_provider') {
      // Track viewed provider
      if (interactionData.providerId) {
        userInteractions[userId].viewedProviders.push(interactionData.providerId);
      }
      
      // Track category preference
      if (interactionData.category) {
        const category = interactionData.category;
        userInteractions[userId].categoryPreferences[category] = 
          (userInteractions[userId].categoryPreferences[category] || 0) + 0.1;
      }
      
      // Track district preference
      if (interactionData.district) {
        const district = interactionData.district;
        userInteractions[userId].districtPreferences[district] = 
          (userInteractions[userId].districtPreferences[district] || 0) + 0.1;
      }
    }
    
    return {
      status: "success",
      message: `Tracked ${interactionType} for user ${userId}`
    };
  },
  
  // Record a booking
  recordBooking: async (providerId: string, userId: string, bookingDetails: any = {}) => {
    console.log(`Recording booking for provider ${providerId} by user ${userId}`);
    
    // Record in booking history
    if (!bookingHistory[providerId]) {
      bookingHistory[providerId] = [];
    }
    
    const booking = {
      userId,
      providerId,
      timestamp: new Date().toISOString(),
      ...bookingDetails
    };
    
    bookingHistory[providerId].push(booking);
    
    // Track interaction as well
    if (userId) {
      await pythonService.trackUserInteraction(userId, 'booking', {
        providerId,
        ...bookingDetails
      });
    }
    
    return {
      status: "success",
      message: `Booking recorded successfully`,
      booking
    };
  },
  
  // Get availability for a provider
  getProviderAvailability: async (providerId: string, daysAhead: number = 7) => {
    console.log(`Getting availability for provider ${providerId}`);
    
    // Find the provider
    const provider = providers.find(p => p.id === providerId);
    if (!provider) {
      return { availability: [] };
    }
    
    // Generate availability based on provider attributes
    const availability = [];
    const now = new Date();
    
    // More experienced providers have fewer slots (they're busier)
    const experience = provider.experience || 1;
    const slotsPerDay = Math.max(1, 5 - Math.min(Math.floor(experience / 3), 4));
    
    // Generate slots for the next X days
    for (let day = 0; day < daysAhead; day++) {
      const currentDate = new Date(now);
      currentDate.setDate(currentDate.getDate() + day);
      
      // No slots on Sundays
      if (currentDate.getDay() === 0) continue;
      
      // Fewer slots on Saturday
      let daySlots = slotsPerDay;
      if (currentDate.getDay() === 6) {
        daySlots = Math.max(1, daySlots - 2);
      }
      
      // Generate random slots for this day
      const dayAvailability = [];
      const possibleHours = Array.from({length: 7}, (_, i) => i + 10); // 10 AM to 4 PM
      possibleHours.sort(() => Math.random() - 0.5); // Shuffle
      
      for (let i = 0; i < Math.min(daySlots, possibleHours.length); i++) {
        const hour = possibleHours[i];
        const slot = {
          date: currentDate.toISOString().split('T')[0],
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: true
        };
        dayAvailability.push(slot);
      }
      
      availability.push(...dayAvailability);
    }
    
    // Sort by date and time
    availability.sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });
    
    return {
      availability
    };
  }
};

// Function to simulate reinforcement learning for a provider when clicked
export const rewardProvider = (providerId: string, reward: number = 0.05) => {
  // Store rewards in session storage
  const storedRewards = sessionStorage.getItem('providerRewards') || '{}';
  const rewards = JSON.parse(storedRewards);
  
  // Update the reward 
  rewards[providerId] = (rewards[providerId] || 0) + reward;
  
  // Store it back
  sessionStorage.setItem('providerRewards', JSON.stringify(rewards));
  
  // Also update our in-memory cache
  providerRewards[providerId] = rewards[providerId];
  
  // In a real app, this would call the Python backend
  pythonService.updateReward(providerId, reward);
};

// Function to get a provider's accumulated reward
export const getProviderReward = (providerId: string): number => {
  const storedRewards = sessionStorage.getItem('providerRewards') || '{}';
  const rewards = JSON.parse(storedRewards);
  return rewards[providerId] || 0;
};

// Track user interaction with a provider (for personalization)
export const trackUserInteraction = async (
  userId: string,
  interactionType: string,
  interactionData: any = {}
) => {
  // Store in session storage
  const storedInteractions = sessionStorage.getItem('userInteractions') || '{}';
  const interactions = JSON.parse(storedInteractions);
  
  // Initialize if needed
  if (!interactions[userId]) {
    interactions[userId] = {
      viewedProviders: [],
      interactionHistory: []
    };
  }
  
  // Add the interaction
  interactions[userId].interactionHistory.push({
    type: interactionType,
    data: interactionData,
    timestamp: new Date().toISOString()
  });
  
  // Store back
  sessionStorage.setItem('userInteractions', JSON.stringify(interactions));
  
  // Call the service
  return pythonService.trackUserInteraction(userId, interactionType, interactionData);
};

// Function to get clustered recommendations based on user preferences
export const getClusteredRecommendations = async (
  userPreferences: {
    category?: string;
    district?: string;
    minExperience?: number;
    minRating?: number;
    maxDistance?: number;
  },
  userId?: string
) => {
  // Initialize the recommendation engine if needed
  await pythonService.initialize();
  
  // Get recommendations with preferences
  const result = await pythonService.getRecommendations(userPreferences);
  return result.recommendations;
};

// Function to get provider availability
export const getProviderAvailability = async (providerId: string, daysAhead: number = 7) => {
  const result = await pythonService.getProviderAvailability(providerId, daysAhead);
  return result.availability || [];
};

// Function to book a provider
export const bookProvider = async (
  providerId: string,
  userId: string = 'guest',
  bookingDetails: any = {}
) => {
  const result = await pythonService.recordBooking(providerId, userId, bookingDetails);
  return result;
};
