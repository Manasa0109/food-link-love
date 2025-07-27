import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import FoodCard from "@/components/FoodCard";
import { useToast } from "@/hooks/use-toast";
import { Heart, Leaf, Users, Package } from "lucide-react";

interface FoodItem {
  id: string;
  item: string;
  availability: string;
  expectedPeople: number;
  location: string;
  contact: string;
  email: string;
  donorName?: string;
}

const Index = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!) 
    : null;

  useEffect(() => {
    fetchAvailableFoods();
  }, []);

  const fetchAvailableFoods = async () => {
    try {
      const response = await fetch('/api/available-foods');
      const data = await response.json();
      
      if (response.ok) {
        setFoods(data.foods || []);
      } else {
        console.error('Failed to fetch foods');
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFood = (foodId: string) => {
    setFoods(foods.filter(food => food.id !== foodId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            FoodShare
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connecting surplus food with those who need it. Together, we can reduce food waste and fight hunger in our communities.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/signup">Join FoodShare</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Leaf className="h-12 w-12 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Reduce Waste</h3>
              <p className="text-muted-foreground">Help prevent perfectly good food from going to waste</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Feed Communities</h3>
              <p className="text-muted-foreground">Connect surplus food with those who need it most</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Package className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Easy Sharing</h3>
              <p className="text-muted-foreground">Simple platform to share and discover food donations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Foods Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Available Food Donations</h2>
            <p className="text-muted-foreground">Fresh food donations available for pickup</p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading available foods...</p>
            </div>
          ) : foods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map((food) => (
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No food donations available</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share surplus food with your community!
                </p>
                {user?.userType === 'donor' && (
                  <Button asChild variant="default">
                    <Link to="/donor-dashboard">Add Food Donation</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
