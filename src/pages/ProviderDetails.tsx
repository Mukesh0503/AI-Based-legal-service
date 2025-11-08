import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { generateFakeProviders } from '@/utils/providers';
import { rewardProvider, generateProviderBadges } from '@/utils/recommendation';
import { pythonService, trackUserInteraction } from '@/utils/pythonService';
import MockMap from '@/components/MockMap';
import { useMapContext } from '@/contexts/MapContext';
import BookingDialog from '@/components/BookingDialog';
import { Calendar, Clock, MapPin, Phone, Mail, Star, Shield, Users, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProviderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [provider, setProvider] = useState<any>(null);
  const [similarProviders, setSimilarProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const { translate, language } = useLanguage();
  
  const { ready } = useMapContext();
  
  useEffect(() => {
    const loadProviderDetails = async () => {
      try {
        console.log("Loading provider details for ID:", id);
        const allProviders = generateFakeProviders(50);
        
        // Fix for malformed provider IDs
        const providerId = id?.replace('provider_erode', 'provider-123') || '';
        const foundProvider = allProviders.find(p => p.id === providerId) || allProviders[0];
        
        if (foundProvider) {
          console.log("Provider found:", foundProvider);
          
          try {
            await pythonService.initialize();
            
            const result = await pythonService.getSimilarProviders(providerId);
            
            const recommendations = await pythonService.getRecommendations();
            const enhancedProvider = recommendations.recommendations.find((p: any) => p.id === providerId);
            
            if (enhancedProvider) {
              setProvider(enhancedProvider);
            } else {
              foundProvider.badges = generateProviderBadges(foundProvider);
              setProvider(foundProvider);
            }
            
            setSimilarProviders(result.similar_providers || []);
            
            // Track view interaction for better recommendations
            trackUserInteraction('current-user', 'view_provider', {
              providerId,
              category: foundProvider.category,
              district: foundProvider.district
            });
          } catch (error) {
            console.error("Error with Python service:", error);
            // Fallback to basic provider data if Python service fails
            foundProvider.badges = generateProviderBadges(foundProvider);
            setProvider(foundProvider);
          }
        } else {
          console.error("Provider not found with ID:", id);
          toast({
            title: translate("providerNotFound") || "Provider not found",
            description: translate("unableToFindProvider") || `Unable to find provider with ID: ${id}`,
            variant: "destructive",
          });
          // Navigate back to home after a short delay
          setTimeout(() => navigate('/'), 3000);
        }
        
        const savedProviders = JSON.parse(localStorage.getItem('savedProviders') || '[]');
        const isSavedProvider = savedProviders.some((p: any) => p.id === providerId);
        setIsSaved(isSavedProvider);
      } catch (error) {
        console.error("Error loading provider details:", error);
        toast({
          title: translate("errorLoading") || "Error loading provider",
          description: translate("couldNotLoad") || "Could not load provider details. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadProviderDetails();
    } else {
      console.error("No ID provided in URL");
      navigate('/');
    }
  }, [id, navigate, toast, translate]);

  const toggleSaveProvider = () => {
    let savedProviders = JSON.parse(localStorage.getItem('savedProviders') || '[]');
    
    if (isSaved) {
      savedProviders = savedProviders.filter((p: any) => p.id !== id);
      toast({
        title: "Provider removed",
        description: "Provider removed from your saved list.",
        duration: 3000,
      });
    } else {
      savedProviders.push(provider);
      toast({
        title: "Provider saved",
        description: "Provider added to your saved list.",
        duration: 3000,
      });
      
      rewardProvider(provider.id, 0.1);
      
      // Track this action for better recommendations
      trackUserInteraction('current-user', 'save_provider', {
        providerId: provider.id,
        category: provider.category,
        district: provider.district
      });
    }
    
    localStorage.setItem('savedProviders', JSON.stringify(savedProviders));
    setIsSaved(!isSaved);
  };
  
  const handleStartBooking = () => {
    setBookingDialogOpen(true);
    
    // Track this action
    rewardProvider(provider.id, 0.15);
    trackUserInteraction('current-user', 'start_booking', {
      providerId: provider.id
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-3xl bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <div className="bg-red-500 text-white p-8 rounded-lg max-w-md mx-auto shadow-lg">
          <h1 className="text-3xl font-bold mb-4">{translate("providerNotFound") || "Provider Not Found"}</h1>
          <p className="text-white mb-8">{translate("providerNotExist") || "The legal service provider you're looking for doesn't exist or has been removed."}</p>
          <Link to="/">
            <Button variant="secondary">{translate("browseAll") || "Browse All Providers"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Link to="/" className="text-primary hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {translate("backToResults") || "Back to Results"}
        </Link>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{provider.name}</h1>
              <p className="text-gray-600 text-lg">{provider.category} Specialist</p>
              
              {provider.score && (
                <div className="mt-2 inline-block bg-green-50 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-green-800" />
                    <span>AI Score: {provider.score}/5.0</span>
                  </div>
                </div>
              )}
            </div>
            <Button 
              variant={isSaved ? "outline" : "default"}
              onClick={toggleSaveProvider}
              className={isSaved ? "border-red-500 text-red-500 hover:bg-red-50" : ""}
            >
              {isSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  Saved
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4 4 0 000 6.364L12 20.364l7.682-7.682a4 4 0 00-6.364-6.364L12 7.636l-1.318-1.318a4 4 0 00-6.364 0z" />
                  </svg>
                  Save Provider
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {provider.verified && (
              <Badge className="bg-blue-500 hover:bg-blue-700 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                <span>Verified</span>
              </Badge>
            )}
            
            {(provider.badges || []).map((badge: string, idx: number) => (
              <Badge 
                key={idx} 
                className={
                  badge === "Highly Recommended" ? "bg-green-500 hover:bg-green-700" :
                  badge === "Fast & Trusted" ? "bg-purple-500 hover:bg-purple-700" :
                  badge === "Trusted Advisor" ? "bg-amber-500 hover:bg-amber-700" :
                  badge === "High Availability" ? "bg-cyan-500 hover:bg-cyan-700" :
                  badge === "Popular Choice" ? "bg-pink-500 hover:bg-pink-700" :
                  "bg-gray-500 hover:bg-gray-700"
                }
              >
                {badge}
              </Badge>
            ))}
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="font-semibold text-lg mb-2">Provider Information</h2>
                  <ul className="space-y-3">
                    <li className="flex">
                      <span className="text-gray-600 w-28">Practice Area:</span>
                      <span className="font-medium">{provider.category}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-600 w-28">Experience:</span>
                      <span className="font-medium">{provider.experience} years</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-600 w-28">Languages:</span>
                      <span className="font-medium">{provider.languages.join(', ')}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-600 w-28">Rating:</span>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < Math.floor(provider.rating) ? "currentColor" : "none"} stroke="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 font-medium">{provider.rating.toFixed(1)}/5.0</span>
                      </div>
                    </li>
                    <li className="flex">
                      <span className="text-gray-600 w-28">Response Time:</span>
                      <span className="font-medium">Usually within {provider.responseTime} hours</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h2 className="font-semibold text-lg mb-2">Location</h2>
                  <ul className="space-y-3 mb-4">
                    <li className="flex">
                      <span className="text-gray-600 w-28">Address:</span>
                      <span className="font-medium">{provider.address || "123 Law Street"}, {provider.district}</span>
                    </li>
                    <li className="flex">
                      <span className="text-gray-600 w-28">District:</span>
                      <span className="font-medium">{provider.district}, Tamil Nadu</span>
                    </li>
                  </ul>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700">
              {provider.name} is a highly {provider.verified ? 'verified' : 'experienced'} legal professional specializing in {provider.category}. 
              With {provider.experience} years of experience practicing in {provider.district}, Tamil Nadu, 
              they have established a strong reputation for providing reliable legal services.
            </p>
            <p className="text-gray-700 mt-4">
              They are fluent in {provider.languages.join(' and ')} and aim to provide accessible legal services to all clients.
              They are committed to maintaining open communication and typically respond to inquiries within {provider.responseTime} hours.
            </p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {provider.category === "Criminal Law" && (
                <>
                  <Badge className="py-2 px-3 text-sm justify-center">Criminal Defense</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Bail Applications</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Criminal Appeals</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">White Collar Crime</Badge>
                </>
              )}
              {provider.category === "Family Law" && (
                <>
                  <Badge className="py-2 px-3 text-sm justify-center">Divorce</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Child Custody</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Maintenance</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Succession</Badge>
                </>
              )}
              {provider.category === "Property Law" && (
                <>
                  <Badge className="py-2 px-3 text-sm justify-center">Title Verification</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Property Registration</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Property Disputes</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Tenant Issues</Badge>
                </>
              )}
              {provider.category === "Civil Law" && (
                <>
                  <Badge className="py-2 px-3 text-sm justify-center">Civil Litigation</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Contract Disputes</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Consumer Rights</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Damages Claims</Badge>
                </>
              )}
              {provider.category === "Taxation" && (
                <>
                  <Badge className="py-2 px-3 text-sm justify-center">Income Tax</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">GST</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Tax Planning</Badge>
                  <Badge className="py-2 px-3 text-sm justify-center">Tax Appeals</Badge>
                </>
              )}
            </div>
          </div>
          
          {similarProviders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">AI Recommended Similar Providers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {similarProviders.map((similar) => (
                  <Card key={similar.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{similar.name}</h3>
                          <p className="text-sm text-gray-600">{similar.category}</p>
                          <div className="flex items-center text-sm mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{similar.rating.toFixed(1)}</span>
                            <span className="mx-1">•</span>
                            <span>{similar.experience} yrs exp.</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {similar.district}, Tamil Nadu
                          </p>
                        </div>
                        <Link 
                          to={`/provider/${similar.id}`}
                          onClick={() => rewardProvider(similar.id, 0.05)}
                        >
                          <Button size="sm" variant="outline">View</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <Card className="mb-6 overflow-hidden">
            <div className="h-64">
              {ready ? (
                <MockMap 
                  markers={[{
                    id: provider.id,
                    lat: provider.location.lat, 
                    lng: provider.location.lng,
                    title: provider.name
                  }]}
                  center={provider.location}
                  zoom={12}
                />
              ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                  Loading map...
                </div>
              )}
            </div>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">{provider.address || "123 Law Street"}</p>
                    <p>{provider.district}, Tamil Nadu</p>
                    <p>India</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span>{provider.name.replace(/\s/g, '').toLowerCase()}@legalmail.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <span>+91 {Math.floor(Math.random() * 9000000000) + 1000000000}</span>
                </li>
              </ul>
              
              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full"
                  onClick={handleStartBooking}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Consultation
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Request Video Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Display available slots preview */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Next Available</h3>
                <Button
                  variant="link"
                  onClick={handleStartBooking}
                  className="p-0 h-auto text-primary"
                >
                  View All Slots
                </Button>
              </div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((_, idx) => {
                  // Generate upcoming dates excluding today
                  const date = new Date();
                  date.setDate(date.getDate() + idx + 1);
                  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                  
                  return (
                    <div key={idx} className="flex items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium">{dayNames[date.getDay()]}</p>
                        <p className="text-sm text-gray-500">{date.getDate()} {monthNames[date.getMonth()]}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleStartBooking}>
                          <Clock className="h-3 w-3 mr-1" /> 
                          {10 + idx}:00 AM
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Booking Dialog */}
      <BookingDialog 
        open={bookingDialogOpen} 
        onOpenChange={setBookingDialogOpen}
        provider={provider}
      />
    </div>
  );
};

export default ProviderDetails;
