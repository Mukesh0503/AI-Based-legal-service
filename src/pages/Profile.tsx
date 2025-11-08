
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { Edit, Clock, Star, Calendar } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 fancy-heading pb-3">
        Your Profile
      </h1>
      
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1 card-hover overflow-hidden border-none shadow-lg bg-gradient-to-br from-white to-muted/30 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
            <CardDescription className="text-sm">Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <div className="rounded-full bg-gradient-to-br from-primary to-secondary text-white h-24 w-24 flex items-center justify-center text-4xl mb-4 shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mt-2">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button variant="outline" className="gap-2 button-hover-effect">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recent Activity */}
        <Card className="md:col-span-2 card-hover border-none shadow-lg bg-gradient-to-br from-white to-muted/30 dark:from-gray-800 dark:to-gray-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Recent Activity
            </CardTitle>
            <CardDescription>Your recent interactions on LegalElegance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {/* Activity items with improved styling */}
              <div className="border-b pb-4 slide-in" style={{ animationDelay: "0.1s" }}>
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-3">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Viewed provider profile</p>
                    <p className="text-sm text-muted-foreground">Advocate Ramesh Kumar - Criminal Law</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4 slide-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-3">
                    <Star className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Saved provider to favorites</p>
                    <p className="text-sm text-muted-foreground">Advocate Sunitha Devi - Family Law</p>
                    <p className="text-xs text-muted-foreground mt-1">4 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="pb-3 slide-in" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/10 p-2 mr-3">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Account created</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
