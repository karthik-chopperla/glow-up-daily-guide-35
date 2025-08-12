import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  AlertCircle, 
  CheckCircle, 
  Navigation, 
  DollarSign,
  Settings,
  Bell,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SOSCase {
  id: string;
  user_id: string;
  location_lat: number;
  location_lng: number;
  symptoms_summary: string;
  medical_flags: any;
  state: string;
  created_at: string;
  subscription_level: string;
  distance_km?: number;
  eta_minutes?: number;
}

interface Assignment {
  id: string;
  sos_id: string;
  state: string;
  assigned_at: string;
  accepted_at?: string;
  arrived_at?: string;
  completed_at?: string;
  eta_minutes?: number;
  sos_case?: SOSCase;
}

const AmbulanceDriverDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(false);
  const [pendingSOSCases, setPendingSOSCases] = useState<SOSCase[]>([]);
  const [activeAssignments, setActiveAssignments] = useState<Assignment[]>([]);
  const [completedCases, setCompletedCases] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load pending SOS cases for ambulance drivers
      const { data: sosData, error: sosError } = await supabase
        .from('sos_cases')
        .select('*')
        .eq('state', 'CREATED')
        .order('created_at', { ascending: true });

      if (sosError) throw sosError;

      // Load active assignments
      const { data: activeData, error: activeError } = await supabase
        .from('sos_assignments')
        .select(`
          *,
          sos_cases!inner(*)
        `)
        .eq('partner_id', user?.id)
        .in('state', ['ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ARRIVED'])
        .order('assigned_at', { ascending: false });

      if (activeError) throw activeError;

      // Load completed cases (last 10)
      const { data: completedData, error: completedError } = await supabase
        .from('sos_assignments')
        .select(`
          *,
          sos_cases!inner(*)
        `)
        .eq('partner_id', user?.id)
        .eq('state', 'COMPLETED')
        .order('assigned_at', { ascending: false })
        .limit(10);

      if (completedError) throw completedError;

      setPendingSOSCases(sosData || []);
      setActiveAssignments((activeData || []) as Assignment[]);
      setCompletedCases((completedData || []) as Assignment[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to new SOS cases
    const sosSubscription = supabase
      .channel('sos-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sos_cases' },
        (payload) => {
          if (payload.new.state === 'CREATED') {
            setPendingSOSCases(prev => [payload.new as SOSCase, ...prev]);
            
            // Show notification for new SOS
            toast({
              title: "New Emergency Alert",
              description: `Emergency at ${payload.new.symptoms_summary}`,
              duration: 10000
            });
          }
        }
      )
      .subscribe();

    // Subscribe to assignment updates
    const assignmentSubscription = supabase
      .channel('assignment-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sos_assignments', filter: `partner_id=eq.${user?.id}` },
        (payload) => {
          loadDashboardData(); // Reload data when assignments change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sosSubscription);
      supabase.removeChannel(assignmentSubscription);
    };
  };

  const acceptSOSCase = async (sosCase: SOSCase) => {
    try {
      // Create assignment
      const { data, error } = await supabase
        .from('sos_assignments')
        .insert({
          sos_id: sosCase.id,
          partner_id: user?.id,
          driver_id: user?.id,
          eta_minutes: 8, // Default ETA
          state: 'ACCEPTED'
        })
        .select()
        .single();

      if (error) throw error;

      // Update SOS case state
      await supabase
        .from('sos_cases')
        .update({ 
          state: 'ASSIGNED',
          assigned_at: new Date().toISOString()
        })
        .eq('id', sosCase.id);

      toast({
        title: "SOS Accepted",
        description: "You have accepted the emergency case. Start navigation to patient location.",
        duration: 5000
      });

      loadDashboardData();
    } catch (error: any) {
      console.error('Error accepting SOS:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to accept SOS case",
        variant: "destructive"
      });
    }
  };

  const updateAssignmentState = async (assignmentId: string, newState: string) => {
    try {
      const updates: any = { state: newState };
      
      if (newState === 'EN_ROUTE') {
        // Driver is on the way
      } else if (newState === 'ARRIVED') {
        updates.arrived_at = new Date().toISOString();
      } else if (newState === 'COMPLETED') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('sos_assignments')
        .update(updates)
        .eq('id', assignmentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Case status updated to ${newState.replace('_', ' ').toLowerCase()}`,
      });

      loadDashboardData();
    } catch (error: any) {
      console.error('Error updating assignment:', error);
      toast({
        title: "Error",
        description: "Failed to update case status",
        variant: "destructive"
      });
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ASSIGNED': return 'bg-blue-500';
      case 'ACCEPTED': return 'bg-green-500';
      case 'EN_ROUTE': return 'bg-orange-500';
      case 'ARRIVED': return 'bg-purple-500';
      case 'COMPLETED': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    // Simplified distance calculation (in reality, use proper geolocation libraries)
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
      {/* Header */}
      <header className="bg-white border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <Truck className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ambulance Driver</h1>
                <p className="text-sm text-gray-600">Emergency Response Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Status:</span>
                <Switch
                  checked={isOnline}
                  onCheckedChange={setIsOnline}
                />
                <Badge variant={isOnline ? "default" : "secondary"}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="active">Active Cases</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{pendingSOSCases.length}</p>
                    <p className="text-sm text-muted-foreground">Pending SOS</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                    <Navigation className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeAssignments.length}</p>
                    <p className="text-sm text-muted-foreground">Active Cases</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedCases.length}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mr-4">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹2,450</p>
                    <p className="text-sm text-muted-foreground">Today's Earnings</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending SOS Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Emergency SOS Cases
                </CardTitle>
                <CardDescription>
                  New emergency requests in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingSOSCases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending emergency cases
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSOSCases.map((sosCase) => (
                      <div key={sosCase.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive" className="text-xs">EMERGENCY</Badge>
                              <Badge variant="outline" className="text-xs">{sosCase.subscription_level}</Badge>
                            </div>
                            <p className="font-medium">{sosCase.symptoms_summary}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>~2.3 km away</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(sosCase.created_at).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`https://maps.google.com/?q=${sosCase.location_lat},${sosCase.location_lng}`)}
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Map
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => acceptSOSCase(sosCase)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Emergency Cases</CardTitle>
                <CardDescription>Cases you're currently handling</CardDescription>
              </CardHeader>
              <CardContent>
                {activeAssignments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No active cases
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeAssignments.map((assignment) => (
                      <div key={assignment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getStateColor(assignment.state)}`}></div>
                              <Badge variant="outline">{assignment.state.replace('_', ' ')}</Badge>
                            </div>
                            <p className="font-medium">{assignment.sos_case?.symptoms_summary}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                              <span>Assigned: {new Date(assignment.assigned_at).toLocaleTimeString()}</span>
                              {assignment.eta_minutes && <span>ETA: {assignment.eta_minutes} mins</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {assignment.state === 'ACCEPTED' && (
                              <Button
                                size="sm"
                                onClick={() => updateAssignmentState(assignment.id, 'EN_ROUTE')}
                              >
                                Start Journey
                              </Button>
                            )}
                            {assignment.state === 'EN_ROUTE' && (
                              <Button
                                size="sm"
                                onClick={() => updateAssignmentState(assignment.id, 'ARRIVED')}
                              >
                                Mark Arrived
                              </Button>
                            )}
                            {assignment.state === 'ARRIVED' && (
                              <Button
                                size="sm"
                                onClick={() => updateAssignmentState(assignment.id, 'COMPLETED')}
                              >
                                Complete Case
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Case History</CardTitle>
                <CardDescription>Your completed emergency responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedCases.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{assignment.sos_case?.symptoms_summary}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Completed: {assignment.completed_at ? new Date(assignment.completed_at).toLocaleDateString() : 'N/A'}</span>
                            <Badge variant="outline">COMPLETED</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">₹500</p>
                          <p className="text-sm text-muted-foreground">Earned</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
                <CardDescription>Your ambulance service earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">₹2,450</p>
                    <p className="text-sm text-muted-foreground">Today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">₹18,750</p>
                    <p className="text-sm text-muted-foreground">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">₹67,200</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Driver Settings</CardTitle>
                <CardDescription>Manage your ambulance and profile settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Vehicle Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                        <p className="text-sm text-muted-foreground">KA-01-AB-1234</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                        <p className="text-sm text-muted-foreground">Basic Ambulance</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Emergency Alerts</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">SMS Notifications</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Updates</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AmbulanceDriverDashboard;