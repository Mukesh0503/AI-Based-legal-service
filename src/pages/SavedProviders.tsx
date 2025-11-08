
import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { generateFakeProviders } from '@/utils/providers';
import { Badge } from '@/components/ui/badge';

const SavedProviders = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [savedProviders, setSavedProviders] = useState<any[]>([]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    // For this demo, we'll generate some fake providers
    const storedProviders = localStorage.getItem('savedProviders');
    if (storedProviders) {
      setSavedProviders(JSON.parse(storedProviders));
    } else {
      // If no saved providers yet, generate some fake ones
      const fakeSaved = generateFakeProviders(5).slice(0, 3);
      setSavedProviders(fakeSaved);
      localStorage.setItem('savedProviders', JSON.stringify(fakeSaved));
    }
  }, []);

  const removeSavedProvider = (id: string) => {
    const updatedProviders = savedProviders.filter(provider => provider.id !== id);
    setSavedProviders(updatedProviders);
    localStorage.setItem('savedProviders', JSON.stringify(updatedProviders));
    toast({
      title: "Provider removed",
      description: "The provider has been removed from your saved list.",
      duration: 3000,
    });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Saved Legal Providers</h1>
      
      {savedProviders.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savedProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{provider.name}</CardTitle>
                    <CardDescription>{provider.category}</CardDescription>
                  </div>
                  {provider.verified && (
                    <Badge className="bg-blue-500 hover:bg-blue-700">Verified</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{provider.rating.toFixed(1)}/5.0</span>
                    <span className="mx-2">•</span>
                    <span>{provider.experience} years exp.</span>
                  </div>
                  <p className="text-gray-600">
                    {provider.district}, Tamil Nadu
                  </p>
                  <div className="mt-1">
                    <span className="text-gray-500">Languages: </span>
                    {provider.languages.join(', ')}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Link to={`/provider/${provider.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  onClick={() => removeSavedProvider(provider.id)}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No saved providers yet</h2>
          <p className="text-gray-600 mb-6">
            Browse legal providers and save your favorites for quick access.
          </p>
          <Link to="/">
            <Button>Find Legal Providers</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedProviders;
