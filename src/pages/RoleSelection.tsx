import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, Pill, Users, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROLE_OPTIONS = [
  { 
    id: 'patient' as const, 
    label: 'Patient', 
    description: 'Looking for healthcare services, booking appointments, and managing my health',
    icon: User,
    color: 'text-blue-600'
  },
  { 
    id: 'doctor' as const, 
    label: 'Doctor', 
    description: 'Providing medical consultations and healthcare services',
    icon: Stethoscope,
    color: 'text-green-600'
  },
  { 
    id: 'pharmacy_partner' as const, 
    label: 'Pharmacy Partner', 
    description: 'Managing medicine inventory and fulfilling prescriptions',
    icon: Pill,
    color: 'text-purple-600'
  },
  { 
    id: 'elder_expert' as const, 
    label: 'Elder Expert', 
    description: 'Sharing traditional medicine knowledge and remedies',
    icon: Users,
    color: 'text-orange-600'
  },
  { 
    id: 'nurse' as const, 
    label: 'Nurse', 
    description: 'Providing nursing care and home healthcare services',
    icon: Heart,
    color: 'text-pink-600'
  }
];

const RoleSelection = () => {
  const { user, profile, setRole, loading, redirectToRoleDashboard } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signin');
      return;
    }

    // If user already has a role, redirect immediately to appropriate dashboard
    if (profile?.role && profile.role !== 'admin') {
      redirectToRoleDashboard(profile.role as 'patient' | 'doctor' | 'pharmacy_partner' | 'elder_expert' | 'nurse');
    }
  }, [user, profile, loading, navigate, redirectToRoleDashboard]);

  const handleRoleSelection = async (role: typeof ROLE_OPTIONS[number]['id']) => {
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
        description: `Welcome! Your account has been set up as ${ROLE_OPTIONS.find(r => r.id === role)?.label}.`,
      });

      // Redirect to appropriate dashboard
      redirectToRoleDashboard(role);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              Choose Your Role
            </CardTitle>
            <CardDescription className="text-lg">
              Please select your account type to continue with Health Mate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROLE_OPTIONS.map((roleOption) => {
                const IconComponent = roleOption.icon;
                return (
                  <Card 
                    key={roleOption.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50"
                    onClick={() => !isLoading && handleRoleSelection(roleOption.id)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <div className={`w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4`}>
                        <IconComponent className={`w-8 h-8 ${roleOption.color}`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{roleOption.label}</h3>
                      <p className="text-muted-foreground text-sm">
                        {roleOption.description}
                      </p>
                      {isLoading && (
                        <div className="mt-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Don't worry, you can always change your role later in settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelection;