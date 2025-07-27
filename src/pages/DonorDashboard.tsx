import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Plus, Package, Users, MapPin, Phone, Mail } from "lucide-react";

const DonorDashboard = () => {
  const [formData, setFormData] = useState({
    item: "",
    availability: "",
    expectedPeople: "",
    location: "",
    contact: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')!) 
    : null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.availability || !formData.expectedPeople || 
        !formData.location || !formData.contact || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(Number(formData.expectedPeople)) || Number(formData.expectedPeople) <= 0) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid number of people.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/add-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItem: formData.item,
          availability: formData.availability,
          expectedPeople: Number(formData.expectedPeople),
          location: formData.location,
          contact: formData.contact,
          emailVal: formData.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Food donation added successfully!",
          description: "Your donation is now available for others to accept.",
        });
        setFormData({
          item: "",
          availability: "",
          expectedPeople: "",
          location: "",
          contact: "",
          email: "",
        });
      } else {
        toast({
          title: "Failed to add donation",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.userType !== 'donor') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                Access denied. This page is only for donors.
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Donor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Share your surplus food with those who need it most
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Food Donation
              </CardTitle>
              <CardDescription>
                Fill in the details of the food you'd like to donate
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="item">Food Item Description</Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="item"
                      value={formData.item}
                      onChange={(e) => handleInputChange("item", e.target.value)}
                      placeholder="Describe the food item (e.g., Fresh vegetables, Cooked meals, Bakery items)"
                      className="pl-10 min-h-[80px]"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    type="text"
                    value={formData.availability}
                    onChange={(e) => handleInputChange("availability", e.target.value)}
                    placeholder="When is it available? (e.g., Today 2-6 PM, Tomorrow morning)"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expectedPeople">Expected Number of People</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="expectedPeople"
                      type="number"
                      min="1"
                      value={formData.expectedPeople}
                      onChange={(e) => handleInputChange("expectedPeople", e.target.value)}
                      placeholder="How many people can this feed?"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Where can it be picked up?"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => handleInputChange("contact", e.target.value)}
                        placeholder="Your phone number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Your email address"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  variant="hero"
                  size="lg"
                >
                  {loading ? "Adding Donation..." : "Add Food Donation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;