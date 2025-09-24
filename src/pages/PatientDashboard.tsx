import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  MapPin, 
  AlertTriangle, 
  Pill, 
  Calendar, 
  Heart,
  Baby,
  Brain,
  Home,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PatientDashboard = () => {
  const { user, profile } = useAuth();

  const quickActions = [
    {
      title: "AI Symptom Checker",
      description: "Get instant health advice based on your symptoms",
      icon: Brain,
      href: "/symptom-checker",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Book Doctor",
      description: "Find and book appointments with healthcare providers",
      icon: Stethoscope,
      href: "/book-doctor",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Emergency SOS",
      description: "Get immediate emergency assistance",
      icon: AlertTriangle,
      href: "/emergency",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Medicine Reminders",
      description: "Set and track your medication schedule",
      icon: Pill,
      href: "/medicine-reminders",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Find Hospitals",
      description: "Locate nearby hospitals and healthcare facilities",
      icon: MapPin,
      href: "/hospitals",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Elder Advice",
      description: "Consult with traditional medicine experts",
      icon: Heart,
      href: "/elder-advice",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Mental Health",
      description: "Access mental health support and resources",
      icon: Brain,
      href: "/mental-health",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      title: "Home Nursing",
      description: "Book professional nursing care at home",
      icon: Home,
      href: "/home-nursing",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Pregnancy Care",
      description: "Comprehensive pregnancy and baby care plans",
      icon: Baby,
      href: "/pregnancy-care",
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
    {
      title: "Insurance",
      description: "Manage your health insurance plans",
      icon: Shield,
      href: "/insurance",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Health Tracking",
      description: "Monitor your daily health metrics",
      icon: Activity,
      href: "/health-tracking",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "My Appointments",
      description: "View and manage your upcoming appointments",
      icon: Calendar,
      href: "/appointments",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || user?.name}</h1>
              <p className="text-primary-foreground/80 mt-2">Your health is our priority</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Health Mate</p>
              <p className="text-lg font-semibold">Patient Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Actions</h2>
          <p className="text-muted-foreground">Access all your healthcare services in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
                onClick={() => window.location.href = action.href}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <IconComponent className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency SOS Button - Always Visible */}
        <div className="fixed bottom-6 right-6">
          <Button 
            size="lg"
            className="h-16 w-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => window.location.href = '/emergency'}
          >
            <AlertTriangle className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;