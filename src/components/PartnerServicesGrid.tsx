import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Building2, 
  Stethoscope, 
  Pill, 
  Heart, 
  Baby, 
  Utensils, 
  Brain, 
  Dumbbell, 
  Shield, 
  TestTube, 
  UserCheck 
} from 'lucide-react';

interface PartnerService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  category: string;
  isFullyImplemented?: boolean;
}

const partnerServices: PartnerService[] = [
  {
    id: 'ambulance_driver',
    title: 'Ambulance Driver',
    description: 'Emergency medical transport services',
    icon: <Truck className="h-8 w-8" />,
    route: '/partner/ambulance-driver',
    category: 'Emergency',
    isFullyImplemented: true
  },
  {
    id: 'hospital_owner',
    title: 'Hospital',
    description: 'Hospital management and patient care',
    icon: <Building2 className="h-8 w-8" />,
    route: '/partner/hospital',
    category: 'Healthcare',
    isFullyImplemented: true
  },
  {
    id: 'doctor',
    title: 'Doctor',
    description: 'Medical consultations and appointments',
    icon: <Stethoscope className="h-8 w-8" />,
    route: '/partner/doctor',
    category: 'Healthcare'
  },
  {
    id: 'pharmacy_shop',
    title: 'Pharmacy',
    description: 'Medicine delivery and prescription services',
    icon: <Pill className="h-8 w-8" />,
    route: '/partner/pharmacy',
    category: 'Healthcare'
  },
  {
    id: 'home_nursing',
    title: 'Home Nursing',
    description: 'At-home medical care and assistance',
    icon: <UserCheck className="h-8 w-8" />,
    route: '/partner/home-nursing',
    category: 'Healthcare'
  },
  {
    id: 'mental_health_support',
    title: 'Mental Health',
    description: 'Counseling and therapy services',
    icon: <Brain className="h-8 w-8" />,
    route: '/partner/mental-health',
    category: 'Wellness'
  },
  {
    id: 'pregnancy_care',
    title: 'Pregnancy & Baby Care',
    description: 'Prenatal and postnatal care services',
    icon: <Baby className="h-8 w-8" />,
    route: '/partner/pregnancy-care',
    category: 'Specialized'
  },
  {
    id: 'diet_plan_advisor',
    title: 'Diet & Nutrition',
    description: 'Meal planning and nutrition guidance',
    icon: <Utensils className="h-8 w-8" />,
    route: '/partner/diet-nutrition',
    category: 'Wellness'
  },
  {
    id: 'fitness_recovery_advisor',
    title: 'Fitness Trainer',
    description: 'Personal training and fitness programs',
    icon: <Dumbbell className="h-8 w-8" />,
    route: '/partner/fitness-trainer',
    category: 'Wellness'
  },
  {
    id: 'health_insurance_agent',
    title: 'Insurance Partner',
    description: 'Health insurance and claims assistance',
    icon: <Shield className="h-8 w-8" />,
    route: '/partner/insurance',
    category: 'Financial'
  },
  {
    id: 'diagnostic_lab',
    title: 'Diagnostic Lab',
    description: 'Medical tests and lab sample collection',
    icon: <TestTube className="h-8 w-8" />,
    route: '/partner/diagnostic-lab',
    category: 'Healthcare'
  },
  {
    id: 'elder_advisor',
    title: 'Elder Care',
    description: 'Senior citizen care and assistance',
    icon: <Heart className="h-8 w-8" />,
    route: '/partner/elder-care',
    category: 'Specialized'
  }
];

const PartnerServicesGrid = () => {
  const navigate = useNavigate();

  const handleServiceSelect = (service: PartnerService) => {
    navigate(service.route);
  };

  const groupedServices = partnerServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, PartnerService[]>);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Partner Services</h1>
        <p className="text-muted-foreground">Choose your service category to get started</p>
      </div>

      {Object.entries(groupedServices).map(([category, services]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{category}</h2>
            <Badge variant="outline">{services.length} services</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/50 relative"
                onClick={() => handleServiceSelect(service)}
              >
                {service.isFullyImplemented && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="text-xs">FULL</Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PartnerServicesGrid;