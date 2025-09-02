import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PARTNER_SERVICES = [
  'AI Symptom Checker',
  'Hospital Finder & Cost Comparison',
  'Expert Elders\' Traditional Advice',
  'Doctor Consultations',
  'Emergency SOS',
  'Smart Medicine Reminders & Intake Tracking',
  'Refill Alerts & Medicine Price Comparison',
  'Diet Plan & Food Booking',
  'Mental Health & Home Nursing',
  'Pregnancy Care Plan',
  'Fitness Support',
  'Insurance Support'
];

const PARTNER_TYPES = [
  'hospital',
  'doctor',
  'expert'
];

const RoleSelection = () => {
  const { user, profile, setRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'partner' | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPartnerType, setSelectedPartnerType] = useState<string>('');
  const [showServiceSelection, setShowServiceSelection] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // If user already has a role, redirect to appropriate dashboard
    if (profile?.role) {
      if (profile.role === 'user') {
        navigate('/user-home');
      } else if (profile.role === 'partner') {
        navigate('/partner-home');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleRoleSelection = (role: 'user' | 'partner') => {
    if (role === 'user') {
      handleSubmit('user');
    } else {
      setSelectedRole('partner');
      setShowServiceSelection(true);
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handlePartnerSubmit = async () => {
    if (!selectedPartnerType || selectedServices.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a partner type and at least one service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await setRole('partner', {
        services: selectedServices,
        type: selectedPartnerType
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to set up partner account. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Welcome! Your partner account has been set up successfully.",
      });

      navigate('/partner-home');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (role: 'user' | 'partner') => {
    setIsLoading(true);

    try {
      const { error } = await setRole(role);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to set role. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Welcome! Your account has been set up as ${role === 'user' ? 'a user' : 'a partner'}.`,
      });

      // Navigate to appropriate dashboard
      navigate('/user-home');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowServiceSelection(false);
    setSelectedRole(null);
    setSelectedServices([]);
    setSelectedPartnerType('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {!showServiceSelection ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-primary">
                Welcome to Health Mate!
              </CardTitle>
              <CardDescription className="text-lg">
                Let's get you started. Please choose your account type:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                  onClick={() => handleRoleSelection('user')}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">I am a User</h3>
                    <p className="text-muted-foreground text-sm">
                      Looking for healthcare services, booking appointments, and managing my health
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                  onClick={() => handleRoleSelection('partner')}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                      <Building className="w-8 h-8 text-secondary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">I am a Partner</h3>
                    <p className="text-muted-foreground text-sm">
                      Providing healthcare services, managing appointments, and growing my business
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-primary">
                    Complete Your Partner Setup
                  </CardTitle>
                  <CardDescription>
                    Choose your partner type and select the services you provide
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Partner Type Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Partner Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PARTNER_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant={selectedPartnerType === type ? "default" : "outline"}
                      className="h-auto p-4 text-left justify-start capitalize"
                      onClick={() => setSelectedPartnerType(type)}
                      disabled={isLoading}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Services Selection */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Services You Provide</h3>
                <p className="text-sm text-muted-foreground">Select all services that apply to your business</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PARTNER_SERVICES.map((service) => (
                    <Button
                      key={service}
                      variant={selectedServices.includes(service) ? "default" : "outline"}
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => handleServiceToggle(service)}
                      disabled={isLoading}
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{service}</div>
                        {selectedServices.includes(service) && (
                          <Badge variant="secondary" className="ml-auto">Selected</Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handlePartnerSubmit}
                  disabled={isLoading || !selectedPartnerType || selectedServices.length === 0}
                  className="px-8"
                >
                  {isLoading ? "Setting up..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;