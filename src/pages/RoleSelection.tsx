import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Building, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SERVICE_TYPES = [
  { value: 'home_remedies_expert', label: 'Home Remedies Expert', category: 'Health' },
  { value: 'hospital_owner', label: 'Hospital Owner', category: 'Health' },
  { value: 'doctor', label: 'Doctor', category: 'Health' },
  { value: 'private_doctor', label: 'Private Doctor', category: 'Health' },
  { value: 'online_doctor', label: 'Online Doctor', category: 'Health' },
  { value: 'pharmacy_shop', label: 'Pharmacy Shop', category: 'Health' },
  { value: 'medical_shop', label: 'Medical Shop', category: 'Health' },
  { value: 'mental_health_support', label: 'Mental Health Support', category: 'Health' },
  { value: 'home_nursing', label: 'Home Nursing', category: 'Health' },
  { value: 'pregnancy_care', label: 'Pregnancy Care', category: 'Health' },
  { value: 'gynecologist', label: 'Gynecologist', category: 'Health' },
  { value: 'diet_plan_advisor', label: 'Diet Plan Advisor', category: 'Health' },
  { value: 'fitness_recovery_advisor', label: 'Fitness Recovery Advisor', category: 'Health' },
  { value: 'health_insurance_agent', label: 'Health Insurance Agent', category: 'Health' },
  { value: 'restaurant_owner', label: 'Restaurant Owner', category: 'Food' },
  { value: 'torrent_owner', label: 'Torrent Owner', category: 'Food' },
  { value: 'emergency_sos', label: 'Emergency SOS', category: 'Emergency' },
  { value: 'ambulance_driver', label: 'Ambulance Driver', category: 'Emergency' },
];

const RoleSelection = () => {
  const { user, profile, setRole, setServiceType, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'partner' | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [showServiceSelection, setShowServiceSelection] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // If user already has a role, redirect to appropriate dashboard
    if (profile?.role) {
      if (profile.role === 'user') {
        navigate('/home');
      } else if (profile.role === 'partner') {
        if (profile.service_type) {
          navigate('/partner-dashboard');
        }
        // If partner but no service_type, stay on role selection for service selection
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

  const handleServiceSelection = async (serviceType: string) => {
    setSelectedService(serviceType);
    setIsLoading(true);

    try {
      const { error } = await setServiceType(serviceType);

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to set service type. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Service type selected successfully!",
      });

      // Navigate to partner homepage
      navigate('/partner-homepage');
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (role: 'user' | 'partner', serviceType?: string) => {
    setIsLoading(true);

    try {
      const { error } = await setRole(role, serviceType);

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
      if (role === 'user') {
        navigate('/home');
      } else {
        // For partners, stay on role selection to choose service type
        setSelectedRole('partner');
        setShowServiceSelection(true);
      }
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
    setSelectedService('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const groupedServices = SERVICE_TYPES.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof SERVICE_TYPES>);

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
                    Select Your Service Category
                  </CardTitle>
                  <CardDescription>
                    Choose the service that best describes your business
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedServices).map(([category, services]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Badge variant="outline">{category}</Badge>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {services.map((service) => (
                        <Button
                          key={service.value}
                          variant={selectedService === service.value ? "default" : "outline"}
                          className="h-auto p-4 text-left justify-start"
                          onClick={() => handleServiceSelection(service.value)}
                          disabled={isLoading}
                        >
                          <div>
                            <div className="font-medium">{service.label}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;