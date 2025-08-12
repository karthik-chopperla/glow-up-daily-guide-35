import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Bell,
  Settings,
  LogOut,
  Building
} from 'lucide-react';

const PartnerDashboard = () => {
  const { user, profile, signOut } = useAuth();

  const getServiceLabel = (serviceType: string) => {
    const serviceLabels: Record<string, string> = {
      'home_remedies_expert': 'Home Remedies Expert',
      'hospital': 'Hospital Owner',
      'private_doctor': 'Private Doctor',
      'medical_shop': 'Medical Shop',
      'pharmacy_dealership': 'Pharmacy Dealership',
      'mental_health_support': 'Mental Health Support',
      'in_home_nursing': 'Home Nursing',
      'pregnancy_care_plan': 'Pregnancy Care',
      'diet_plan_advisor': 'Diet Plan Advisor',
      'fitness_recovery_advisor': 'Fitness Recovery Advisor',
      'health_insurance_agent': 'Health Insurance Agent',
      'restaurant': 'Restaurant Owner',
      'catering_service': 'Catering Service',
      'hotel': 'Hotel',
      'cloud_kitchen': 'Cloud Kitchen',
      'omlens_driver': 'Emergency Driver',
    };
    return serviceLabels[serviceType] || serviceType;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Partner Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Building className="w-4 h-4 mr-1" />
              {profile?.service_type ? getServiceLabel(profile.service_type) : 'Partner'}
            </Badge>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold">248</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">₹45,230</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Your upcoming and recent patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Patient {i + 1}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() + i * 86400000).toLocaleDateString()} at {9 + i}:00 AM
                      </p>
                    </div>
                    <Badge variant={i === 0 ? "default" : "outline"}>
                      {i === 0 ? "Today" : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your practice efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Patients
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Service-Specific Content */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>
                Tools and features specific to your {profile?.service_type ? getServiceLabel(profile.service_type) : 'service'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Analytics
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  Customer Base
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Settings className="w-6 h-6 mb-2" />
                  Service Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;