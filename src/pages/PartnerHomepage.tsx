import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  FileText, 
  Calendar, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Package,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PartnerHomepage = () => {
  const { profile } = useAuth();

  const serviceTypeLabels: Record<string, string> = {
    'home_remedies_expert': 'Home Remedies Expert',
    'hospital_owner': 'Hospital Owner',
    'doctor': 'Doctor',
    'private_doctor': 'Private Doctor',
    'online_doctor': 'Online Doctor',
    'pharmacy_shop': 'Pharmacy Shop',
    'medical_shop': 'Medical Shop',
    'mental_health_support': 'Mental Health Support',
    'home_nursing': 'Home Nursing',
    'pregnancy_care': 'Pregnancy Care',
    'gynecologist': 'Gynecologist',
    'diet_plan_advisor': 'Diet Plan Advisor',
    'fitness_recovery_advisor': 'Fitness Recovery Advisor',
    'health_insurance_agent': 'Health Insurance Agent',
    'restaurant_owner': 'Restaurant Owner',
    'torrent_owner': 'Torrent Owner',
    'emergency_sos': 'Emergency SOS',
    'ambulance_driver': 'Ambulance Driver',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Partner Dashboard</h1>
              {profile?.partner_type && (
                <Badge variant="secondary" className="ml-3">
                  {serviceTypeLabels[profile.partner_type] || profile.partner_type}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
              </Button>
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mr-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Active Orders</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mr-4">
                <DollarSign className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">₹8,450</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">45</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Satisfaction</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New booking request</p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Service reminder</p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Orders & Billing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Orders & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#ORD-001</p>
                    <p className="text-sm text-muted-foreground">Health Consultation</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹500</p>
                    <Badge variant="default" className="text-xs">Completed</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#ORD-002</p>
                    <p className="text-sm text-muted-foreground">Medicine Delivery</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹250</p>
                    <Badge variant="secondary" className="text-xs">Pending</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">#ORD-003</p>
                    <p className="text-sm text-muted-foreground">Home Visit</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹800</p>
                    <Badge variant="outline" className="text-xs">Scheduled</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Order Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Order Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Appointment at 2:00 PM</p>
                      <p className="text-xs text-muted-foreground">Patient: John Doe</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Today</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Follow-up consultation</p>
                      <p className="text-xs text-muted-foreground">Patient: Jane Smith</p>
                    </div>
                  </div>
                  <Badge variant="outline">Tomorrow</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Medicine delivery</p>
                      <p className="text-xs text-muted-foreground">Order #ORD-004</p>
                    </div>
                  </div>
                  <Badge variant="outline">Wed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                Your recent transactions and earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="text-sm font-medium">January 2024</p>
                    <p className="text-xs text-muted-foreground">15 services completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+₹12,500</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="text-sm font-medium">December 2023</p>
                    <p className="text-xs text-muted-foreground">18 services completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+₹14,200</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <div>
                    <p className="text-sm font-medium">November 2023</p>
                    <p className="text-xs text-muted-foreground">12 services completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+₹9,800</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Download Statement
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerHomepage;