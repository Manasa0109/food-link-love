import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import FoodCard from "@/components/FoodCard";
import { Package, Clock, CheckCircle } from "lucide-react";

interface FoodItem {
  id: string;
  item: string;
  availability: string;
  expectedPeople: number;
  location: string;
  contact: string;
  email: string;
  status?: 'available' | 'waiting' | 'received';
  acceptedBy?: string;
}

const UserDashboard = () => {
  const [availableFoods, setAvailableFoods] = useState<FoodItem[]>([]);
  const [myAcceptedFoods, setMyAcceptedFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!) 
    : null;

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:8080/available-foods');
      const data = await response.json();
      
      if (response.ok) {
        const formattedFoods = data.map((food: any) => ({
          id: food._id,
          item: food.foodItem,
          availability: `${food.availability} kg`,
          expectedPeople: food.expectedPeople,
          location: food.location,
          contact: food.contact,
          email: food.emailVal,
          status: food.accepted ? 'waiting' : 'available',
          acceptedBy: food.acceptedBy
        }));
        
        // Filter foods into available and my accepted
        const available = formattedFoods.filter((food: FoodItem) => food.status === 'available');
        const myAccepted = formattedFoods.filter((food: FoodItem) => 
          food.status === 'waiting' && food.acceptedBy === user?.name
        );
        
        setAvailableFoods(available);
        setMyAcceptedFoods(myAccepted);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      toast({
        title: "Error loading foods",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFood = (foodId: string) => {
    setAvailableFoods(availableFoods.filter(food => food.id !== foodId));
    fetchFoods(); // Refresh to get updated data
  };

  if (!user || user.userType === 'donor') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                Access denied. This page is for food recipients.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Food Dashboard
          </h1>
          <p className="text-muted-foreground">
            Discover and grab available food donations in your area
          </p>
        </div>

        {/* My Accepted Foods - Only show if user has accepted foods */}
        {myAcceptedFoods.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                My Accepted Foods
              </h2>
              <Badge variant="secondary" className="ml-2">
                {myAcceptedFoods.length} waiting for pickup
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myAcceptedFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  userType={user?.userType}
                  onAccept={handleAcceptFood}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Foods */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Available Food Donations
            </h2>
            <Badge variant="outline" className="ml-2">
              {availableFoods.length} available
            </Badge>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading available foods...</p>
            </div>
          ) : availableFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  userType={user?.userType}
                  onAccept={handleAcceptFood}
                />
              ))}
            </div>
          ) : (
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No food donations available
                </h3>
                <p className="text-muted-foreground">
                  Check back later for new donations in your area!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;