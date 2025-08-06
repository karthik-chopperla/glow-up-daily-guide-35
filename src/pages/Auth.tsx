
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Heart, Phone, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [userRole, setUserRole] = useState<'user' | 'partner'>('user');
  const [partnerType, setPartnerType] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (userRole === 'partner' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error("Location error:", error)
      );
    }
  }, [userRole]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    // Determine if identifier is email or phone
    const isEmail = authMethod === 'email' || identifier.includes('@');
    
    try {
      const { error } = await signUp(
        isEmail ? identifier : `${identifier}@temp.com`, 
        password, 
        { 
          full_name: name,
          role: userRole,
          phone: phone || identifier,
          partner_type: userRole === 'partner' ? partnerType : null,
          address: userRole === 'partner' ? address : null,
          location_lat: location?.lat,
          location_lng: location?.lng
        }
      );
      
      if (error) {
        setError(error.message);
      } else {
        if (isEmail) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now sign in with your phone number.",
          });
        }
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
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const loginIdentifier = isEmail ? identifier : `${identifier}@temp.com`;

    const { error } = await signIn(loginIdentifier, password);
    
    if (error) {
      setError(error.message);
    } else {
      // Check user role and redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      if (profile?.role === 'partner') {
        navigate("/partner-home");
      } else {
        navigate("/user-home");
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Health Mate</CardTitle>
          <CardDescription>Your personal health companion</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <div className="space-y-4">
                <RadioGroup 
                  value={authMethod} 
                  onValueChange={(value: 'email' | 'phone') => setAuthMethod(value)}
                  className="flex justify-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-signin" />
                    <Label htmlFor="email-signin" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-signin" />
                    <Label htmlFor="phone-signin" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                  </div>
                </RadioGroup>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-identifier">
                      {authMethod === 'email' ? 'Email' : 'Phone Number'}
                    </Label>
                    <Input
                      id="signin-identifier"
                      name="identifier"
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                      required
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-4">
                <RadioGroup 
                  value={authMethod} 
                  onValueChange={(value: 'email' | 'phone') => setAuthMethod(value)}
                  className="flex justify-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email-signup" />
                    <Label htmlFor="email-signup" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="phone" id="phone-signup" />
                    <Label htmlFor="phone-signup" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                  </div>
                </RadioGroup>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <RadioGroup 
                    value={userRole} 
                    onValueChange={(value: 'user' | 'partner') => setUserRole(value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="user" id="user-role" />
                      <Label htmlFor="user-role">User</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="partner" id="partner-role" />
                      <Label htmlFor="partner-role">Partner (Doctor/Hospital)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-identifier">
                      {authMethod === 'email' ? 'Email' : 'Phone Number'}
                    </Label>
                    <Input
                      id="signup-identifier"
                      name="identifier"
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {authMethod === 'phone' && (
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  
                  {userRole === 'partner' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="partner-type">Partner Type</Label>
                        <Select value={partnerType} onValueChange={setPartnerType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select partner type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="doctor">Doctor</SelectItem>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="ambulance">Ambulance</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your address"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      {location && (
                        <div className="text-sm text-muted-foreground">
                          Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
