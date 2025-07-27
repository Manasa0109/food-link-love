import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Users, Mail, Phone } from "lucide-react";

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

interface FoodCardProps {
  food: FoodItem;
  userType?: string;
  onAccept?: (foodId: string) => void;
}

const FoodCard = ({ food, userType, onAccept }: FoodCardProps) => {
  const { toast } = useToast();

  const handleAccept = async () => {
    try {
      const user = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')!) 
        : null;

      if (!user) {
        toast({
          title: "Please login first",
          description: "You need to be logged in to accept food donations.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch('/api/accept-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodId: food.id,
          accepterName: user.name,
          accepterEmail: user.email,
          accepterType: user.userType,
        }),
      });

      if (response.ok) {
        toast({
          title: "Food accepted successfully!",
          description: `You've accepted ${food.item}. The donor will be notified.`,
          variant: "default",
        });
        onAccept?.(food.id);
      } else {
        throw new Error('Failed to accept food');
      }
    } catch (error) {
      toast({
        title: "Error accepting food",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gradient-to-br from-card to-muted/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-foreground">
            {food.item}
          </CardTitle>
          <Badge variant="secondary" className="ml-2">
            <Users className="h-3 w-3 mr-1" />
            {food.expectedPeople} people
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          {food.location}
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-foreground">Available:</span>
          <span className="ml-2 text-muted-foreground">{food.availability}</span>
        </div>

        {food.donorName && (
          <div className="text-sm">
            <span className="font-medium text-foreground">Donor:</span>
            <span className="ml-2 text-muted-foreground">{food.donorName}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center">
            <Phone className="h-3 w-3 mr-1" />
            {food.contact}
          </div>
          <div className="flex items-center">
            <Mail className="h-3 w-3 mr-1" />
            {food.email}
          </div>
        </div>
      </CardContent>
      
      {userType && userType !== 'donor' && (
        <CardFooter>
          <Button 
            onClick={handleAccept} 
            variant="success" 
            className="w-full"
            size="sm"
          >
            Accept Food Donation
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FoodCard;