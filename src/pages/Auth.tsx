import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PARTNER_TYPES = [
  { value: 'home_remedies_expert', label: 'Home Remedies Expert' },
  { value: 'elder_advisor', label: 'Elder Advisor' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'private_doctor', label: 'Private Doctor' },
  { value: 'medical_shop', label: 'Medical Shop' },
  { value: 'pharmacy_dealership', label: 'Pharmacy Dealership' },
  { value: 'mental_health_support', label: 'Mental Health Support' },
  { value: 'in_home_nursing', label: 'In-Home Nursing' },
  { value: 'pregnancy_care_plan', label: 'Pregnancy Care Plan' },
  { value: 'diet_plan_advisor', label: 'Diet Plan Advisor' },
  { value: 'fitness_recovery_advisor', label: 'Fitness Recovery Advisor' },
  { value: 'health_insurance_agent', label: 'Health Insurance Agent' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'catering_service', label: 'Catering Service' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cloud_kitchen', label: 'Cloud Kitchen' },
  { value: 'omlens_driver', label: 'Omlens Driver' }
];

const CITIES = ['Eluru', 'Bewaram', 'Palkollu', 'Vijayawada', 'Vizag'];

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<'user' | 'partner'>('user');
  const [partnerType, setPartnerType] = useState('');
  const [city, setCity] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const { error } = await signUp(phoneNumber, password, {
        full_name: name,
        role: userRole === 'partner' ? partnerType : 'user',
        phone_number: phoneNumber,
        city: city,
      });
      
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to your health platform!",
        });
        setUserName(name);
        setShowWelcome(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError("An error occurred during sign up");
    }
    
    setIsLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const phoneNumber = formData.get("phoneNumber") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn(phoneNumber, password);
    
    if (error) {
      setError(error.message);
    } else {
      // Try to show welcome message
      try {
        const formData2 = new FormData(e.currentTarget);
        const nameFromForm = formData2.get("name") as string;
        if (nameFromForm) {
          setUserName(nameFromForm);
          setShowWelcome(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          navigate('/');
        }
      } catch {
        navigate('/');
      }
    }
    
    setIsLoading(false);
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-4">
            Welcome {userName}!
          </div>
          <div className="text-muted-foreground">
            Redirecting to your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Your Health One Tap Away
          </CardTitle>
          <CardDescription>
            Join our medical platform for comprehensive healthcare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-phone">Phone Number</Label>
                  <Input
                    id="signin-phone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup 
                    value={userRole} 
                    onValueChange={(value: 'user' | 'partner') => setUserRole(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user" />
                      <Label htmlFor="user">User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partner" id="partner" />
                      <Label htmlFor="partner">Partner/Collaborator</Label>
                    </div>
                  </RadioGroup>
                </div>

                {userRole === 'partner' && (
                  <>
                    <div className="space-y-2">
                      <Label>Partner Role</Label>
                      <Select value={partnerType} onValueChange={setPartnerType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {PARTNER_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Select value={city} onValueChange={setCity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                          {CITIES.map((cityOption) => (
                            <SelectItem key={cityOption} value={cityOption}>
                              {cityOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || (userRole === 'partner' && (!partnerType || !city))}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;