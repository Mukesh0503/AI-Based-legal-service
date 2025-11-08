import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { generateFakeProviders, getAvailableDistricts, getDistrictCoordinates } from '@/utils/providers';
import { calculateDistance, rewardProvider, getClusteredRecommendations, generateProviderBadges } from '@/utils/recommendation';
import MockMap from '@/components/MockMap';
import { useMapContext } from '@/contexts/MapContext';
import { AlertCircle, MapPin, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const { toast } = useToast();
  const [isMapView, setIsMapView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [category, setCategory] = useState('all-categories');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [experienceFilter, setExperienceFilter] = useState(0);
  const [distanceFilter, setDistanceFilter] = useState(60);
  const [providers, setProviders] = useState<any[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 11.1271, lng: 78.6569 }); // Center of Tamil Nadu
  const [currentPage, setCurrentPage] = useState(1);
  const [isAIRecommending, setIsAIRecommending] = useState(false);
  const providersPerPage = 9;
  
  // Use our enhanced MapContext
  const { 
    ready, 
    userLocation, 
    userDistrict, 
    locationStatus, 
    detectUserLocation 
  } = useMapContext();
  
  const categories = [
    'Criminal Law',
    'Family Law',
    'Property Law',
    'Civil Law',
    'Taxation',
  ];
  
  const districts = getAvailableDistricts();
  
  useEffect(() => {
    // Generate providers
    try {
      const allProviders = generateFakeProviders(100);
      setProviders(allProviders);
      setFilteredProviders(allProviders);
    } catch (error) {
      console.error("Failed to generate providers:", error);
      // Provide empty arrays as fallback
      setProviders([]);
      setFilteredProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Monitor location status changes
  useEffect(() => {
    if (locationStatus === 'success' && userDistrict && userLocation) {
      setSelectedLocation(userDistrict);
      setMapCenter(userLocation);
      
      toast({
        title: "Location detected",
        description: `You appear to be in ${userDistrict}`,
        duration: 3000,
      });
    } else if (locationStatus === 'permission-denied') {
      toast({
        title: "Location access denied",
        description: "Please check your browser permissions and try again",
        variant: "destructive",
        duration: 5000,
      });
    } else if (locationStatus === 'unavailable') {
      toast({
        title: "Location unavailable",
        description: "We couldn't access your location. Please try again or select manually",
        variant: "destructive",
        duration: 5000,
      });
    } else if (locationStatus === 'timeout') {
      toast({
        title: "Location request timed out",
        description: "Please try again or select a location manually",
        variant: "destructive",
        duration: 5000,
      });
    } else if (locationStatus === 'error') {
      toast({
        title: "Location error",
        description: "An unknown error occurred. Please select a location manually",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [locationStatus, userDistrict, userLocation, toast]);
  
  useEffect(() => {
    if (providers.length === 0) return;
    
    const applyFilters = async () => {
      setIsAIRecommending(true);
      
      try {
        // Use our AI clustering and recommendation system
        const userPreferences = {
          category: category !== 'all-categories' ? category : undefined,
          district: selectedLocation || undefined,
          minRating: ratingFilter > 0 ? ratingFilter : undefined,
          minExperience: experienceFilter > 0 ? experienceFilter : undefined,
          maxDistance: distanceFilter < 60 ? distanceFilter : undefined
        };
        
        // Get recommendations using the AI recommendation engine
        const recommendations = await getClusteredRecommendations(userPreferences);
        
        if (recommendations.length === 0 && selectedLocation) {
          toast({
            title: "No results found in selected location",
            description: "Showing top-rated options within 60km radius",
            duration: 3000,
          });
          
          // Fallback to broader recommendations
          const broaderRecommendations = await getClusteredRecommendations({
            category: category !== 'all-categories' ? category : undefined,
            minRating: ratingFilter > 0 ? ratingFilter : undefined,
            minExperience: experienceFilter > 0 ? experienceFilter : undefined,
            maxDistance: 60
          });
          
          setFilteredProviders(broaderRecommendations);
        } else {
          setFilteredProviders(recommendations);
        }
        
        // Update map center if location selected
        if (selectedLocation) {
          const locationCoords = getDistrictCoordinates(selectedLocation);
          if (locationCoords) {
            setMapCenter(locationCoords);
          }
        }
      } catch (error) {
        console.error("Error getting recommendations:", error);
        setFilteredProviders([]);
      } finally {
        setIsAIRecommending(false);
        setCurrentPage(1);
      }
    };
    
    applyFilters();
  }, [selectedLocation, category, ratingFilter, experienceFilter, distanceFilter, providers]);
  
  const detectLocation = async () => {
    setIsLoading(true);
    await detectUserLocation();
    setIsLoading(false);
  };
  
  const handleProviderClick = (providerId: string) => {
    // Apply reinforcement learning reward when user clicks on a provider
    rewardProvider(providerId);
    
    // Navigate to provider details
    window.location.href = `/provider/${providerId}`;
  };
  
  const currentProviders = filteredProviders.slice(
    (currentPage - 1) * providersPerPage,
    currentPage * providersPerPage
  );
  
  const totalPages = Math.ceil(filteredProviders.length / providersPerPage);
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-[#1A1F2C] to-[#6E59A5] text-white py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="lg:w-1/2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Find Verified Legal Experts Near You
              </h1>
              <p className="text-xl mb-8 text-gray-200">
                Connect with trusted legal professionals in Tamil Nadu. Get expert advice for your legal needs.
              </p>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-5">
                  <label className="block text-sm font-medium mb-2">Where are you located?</label>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}
                    >
                      <SelectTrigger className="flex-1 bg-white/20 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      variant="outline" 
                      className="whitespace-nowrap bg-white/20 hover:bg-white/30 border-white/30"
                      onClick={detectLocation}
                      disabled={isLoading || locationStatus === 'detecting'}
                    >
                      {isLoading || locationStatus === 'detecting' ? (
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-1" />
                          Auto Detect
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">What type of legal service do you need?</label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                    >
                      <SelectTrigger className="w-full bg-white/20 backdrop-blur-md border-white/30 text-white">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                    Find Legal Experts
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 bg-white rounded-lg shadow-xl p-6">
                <h3 className="text-gray-800 font-bold text-lg mb-4">Why Choose LegalElegance?</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Verified legal providers across Tamil Nadu</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Smart recommendations based on your needs</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Transparent ratings and reviews</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Easy booking and consultation setup</span>
                  </li>
                </ul>
              </div>
              <div className="absolute top-10 -right-4 w-64 h-64 bg-[#9b87f5]/30 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-4 w-64 h-64 bg-[#FEC6A1]/30 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto max-w-7xl py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Filters</CardTitle>
                <CardDescription>Find your perfect legal match</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Legal Category</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Rating</Label>
                    <span className="text-sm font-medium">{ratingFilter} / 5</span>
                  </div>
                  <Slider
                    value={[ratingFilter]}
                    min={0}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => setRatingFilter(value[0])}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Minimum Experience (years)</Label>
                    <span className="text-sm font-medium">{experienceFilter}</span>
                  </div>
                  <Slider
                    value={[experienceFilter]}
                    min={0}
                    max={20}
                    step={1}
                    onValueChange={(value) => setExperienceFilter(value[0])}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Distance (km)</Label>
                    <span className="text-sm font-medium">{distanceFilter} km</span>
                  </div>
                  <Slider
                    value={[distanceFilter]}
                    min={5}
                    max={60}
                    step={5}
                    onValueChange={(value) => setDistanceFilter(value[0])}
                    disabled={!selectedLocation}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setRatingFilter(0);
                    setExperienceFilter(0);
                    setDistanceFilter(60);
                    setCategory('all-categories');
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  AI-Recommended Legal Experts
                </CardTitle>
                <CardDescription>
                  Based on smart ranking algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredProviders.slice(0, 5).map((provider, index) => (
                  <div 
                    key={provider.id} 
                    className={`flex items-center gap-3 ${index !== 4 ? "border-b pb-3" : ""}`}
                  >
                    <div className={`
                      h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium
                      ${index === 0 ? 'bg-yellow-500' : ''}
                      ${index === 1 ? 'bg-gray-400' : ''}
                      ${index === 2 ? 'bg-amber-700' : ''}
                    `}>
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-sm text-gray-600">
                        {provider.category} • {provider.score || provider.rating.toFixed(1)} ⭐
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-xs text-gray-500 italic">
                  AI-powered recommendations updated in real-time using Q-learning and fuzzy logic algorithms
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isAIRecommending ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
                    AI Finding Matches...
                  </div>
                ) : (
                  `${filteredProviders.length} AI-Matched Legal Providers`
                )}
              </h2>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="view-mode" className={isMapView ? "text-gray-500" : "font-medium"}>List</Label>
                <Switch 
                  id="view-mode" 
                  checked={isMapView} 
                  onCheckedChange={setIsMapView}
                />
                <Label htmlFor="view-mode" className={!isMapView ? "text-gray-500" : "font-medium"}>Map</Label>
              </div>
            </div>
            
            {isMapView && (
              <div className="h-[650px] rounded-lg overflow-hidden shadow-md border border-gray-200 mb-6">
                {ready ? (
                  <MockMap 
                    markers={filteredProviders.map(provider => ({
                      id: provider.id,
                      lat: provider.location.lat,
                      lng: provider.location.lng,
                      title: provider.name
                    }))}
                    center={mapCenter}
                    onMarkerClick={providerId => setSelectedMarker(providerId)}
                    zoom={10}
                    selectedDistrict={selectedLocation}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
                      <p>Loading map...</p>
                    </div>
                  </div>
                )}
                
                {selectedMarker && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                    {(() => {
                      const provider = filteredProviders.find((p) => p.id === selectedMarker);
                      if (!provider) return null;
                      return (
                        <>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{provider.name}</h3>
                              <p className="text-sm text-gray-600">{provider.category}</p>
                              <div className="flex items-center text-sm mt-1">
                                <span className="text-yellow-500 mr-1">★</span>
                                <span>{provider.rating.toFixed(1)}</span>
                                <span className="mx-1">•</span>
                                <span>{provider.experience} yrs exp.</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setSelectedMarker(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Link 
                              to={`/provider/${provider.id}`}
                              className="text-primary text-sm font-medium flex-1"
                              onClick={() => rewardProvider(provider.id)}
                            >
                              <Button size="sm" className="w-full">View Details</Button>
                            </Link>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
            
            {!isMapView && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {isAIRecommending ? (
                    Array(6).fill(0).map((_, i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-9 bg-gray-200 rounded w-full animate-pulse"></div>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    currentProviders.map((provider) => (
                      <Card key={provider.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{provider.name}</CardTitle>
                              <CardDescription>{provider.category}</CardDescription>
                            </div>
                            {provider.verified && (
                              <Badge className="bg-blue-500 hover:bg-blue-700">Verified</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-medium">
                                {provider.score ? `${provider.score}/5.0` : `${provider.rating.toFixed(1)}/5.0`}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{provider.experience} years exp.</span>
                            </div>
                            <p className="text-gray-600">
                              {provider.district}, Tamil Nadu
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {(provider.badges || generateProviderBadges(provider)).map((badge, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline" 
                                  className={`text-xs ${
                                    badge === "Highly Recommended" 
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : badge === "Fast & Trusted" 
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : badge === "New Provider"
                                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                          : "bg-purple-50 text-purple-700 border-purple-200"
                                  }`}
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Link 
                            to={`/provider/${provider.id}`} 
                            className="w-full"
                            onClick={() => rewardProvider(provider.id)}
                          >
                            <Button variant="outline" className="w-full">View Details</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
                
                {filteredProviders.length > providersPerPage && (
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    <Button 
                      variant="outline" 
                      onClick={prevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
