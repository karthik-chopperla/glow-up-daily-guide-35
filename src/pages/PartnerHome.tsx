import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Phone,
  CheckCircle,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SOSAlert {
  id: string;
  user_id: string;
  location_lat: number;
  location_lng: number;
  timestamp: string;
  status: string;
  profiles?: {
    full_name: string;
  };
}

interface Appointment {
  id: string;
  user_id: string;
  doctor_name: string;
  appointment_time: string;
  status: string;
  specialty: string;
  type: string;
  message?: string;
  profiles?: {
    full_name: string;
  };
}

const PartnerHome = () => {
  const [sosAlerts, setSOSAlerts] = useState<SOSAlert[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAlerts, setNewAlerts] = useState<string[]>([]);
  const [newAppointments, setNewAppointments] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchSOSAlerts();
    fetchAppointments();
    
    // Set up realtime listeners
    const sosChannel = supabase
      .channel('sos-alerts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sos_alerts' },
        (payload) => {
          toast({
            title: "🚨 NEW SOS ALERT!",
            description: "Emergency assistance needed nearby",
            variant: "destructive"
          });
          setNewAlerts(prev => [...prev, payload.new.id]);
          fetchSOSAlerts();
        }
      )
      .subscribe();

    const appointmentChannel = supabase
      .channel('appointments')
      .on('postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'appointments',
          filter: `partner_id=eq.${user?.id}`
        },
        (payload) => {
          toast({
            title: "📅 New Appointment Request",
            description: "A patient has booked an appointment with you",
          });
          setNewAppointments(prev => [...prev, payload.new.id]);
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sosChannel);
      supabase.removeChannel(appointmentChannel);
    };
  }, [user?.id]);

  const fetchSOSAlerts = async () => {
    const { data } = await supabase
      .from('sos_alerts')
      .select('*')
      .eq('status', 'active')
      .order('timestamp', { ascending: false });
    
    if (data) {
      // Fetch user profiles separately
      const alertsWithProfiles = await Promise.all(
        data.map(async (alert) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', alert.user_id)
            .single();
          
          return { ...alert, profiles: profile };
        })
      );
      setSOSAlerts(alertsWithProfiles as SOSAlert[]);
    }
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('partner_id', user.id)
      .order('appointment_time', { ascending: true });
    
    if (data) {
      // Fetch user profiles separately
      const appointmentsWithProfiles = await Promise.all(
        data.map(async (appointment) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', appointment.user_id)
            .single();
          
          return { ...appointment, profiles: profile };
        })
      );
      setAppointments(appointmentsWithProfiles as Appointment[]);
    }
  };

  const handleSOSResponse = async (alertId: string) => {
    const { error } = await supabase
      .from('sos_alerts')
      .update({ status: 'responded' })
      .eq('id', alertId);
    
    if (!error) {
      toast({
        title: "Response Sent",
        description: "You have responded to the SOS alert",
      });
      setNewAlerts(prev => prev.filter(id => id !== alertId));
      fetchSOSAlerts();
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId);
    
    if (!error) {
      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${status}`,
      });
      setNewAppointments(prev => prev.filter(id => id !== appointmentId));
      fetchAppointments();
    }
  };

  const markAsRead = (alertId: string, type: 'sos' | 'appointment') => {
    if (type === 'sos') {
      setNewAlerts(prev => prev.filter(id => id !== alertId));
    } else {
      setNewAppointments(prev => prev.filter(id => id !== alertId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Partner Dashboard</h1>
          <p className="text-muted-foreground">Manage emergency alerts and appointments</p>
        </div>

        {/* Emergency SOS Alerts */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Active SOS Alerts
              {newAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {newAlerts.length} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Emergency alerts from users requiring immediate assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sosAlerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No active SOS alerts
              </p>
            ) : (
              <div className="space-y-4">
                {sosAlerts.map((alert) => (
                  <Alert 
                    key={alert.id} 
                    variant="destructive"
                    className={newAlerts.includes(alert.id) ? "ring-2 ring-destructive animate-pulse" : ""}
                    onClick={() => markAsRead(alert.id, 'sos')}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <div className="flex-1">
                      <AlertDescription className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">
                              Emergency Alert from {alert.profiles?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm">
                              <MapPin className="inline h-3 w-3 mr-1" />
                              Location: {alert.location_lat.toFixed(4)}, {alert.location_lng.toFixed(4)}
                            </p>
                            <p className="text-sm">
                              <Clock className="inline h-3 w-3 mr-1" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="space-x-2">
                            <Button
                              variant="destructive"
                              onClick={() => handleSOSResponse(alert.id)}
                              className="bg-white text-destructive hover:bg-gray-100"
                            >
                              Send Ambulance
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => window.open(`https://maps.google.com?q=${alert.location_lat},${alert.location_lng}`, '_blank')}
                              className="bg-white"
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              View on Map
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Incoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Requests
              {newAppointments.length > 0 && (
                <Badge variant="default" className="ml-2">
                  {newAppointments.length} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Manage incoming appointment requests from patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No appointment requests
              </p>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card 
                    key={appointment.id} 
                    className={`${newAppointments.includes(appointment.id) ? "ring-2 ring-primary" : ""} cursor-pointer`}
                    onClick={() => markAsRead(appointment.id, 'appointment')}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {appointment.profiles?.full_name || 'Unknown Patient'}
                            </span>
                            {newAppointments.includes(appointment.id) && (
                              <Badge variant="default">New</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              <Calendar className="inline h-3 w-3 mr-1" />
                              {new Date(appointment.appointment_time).toLocaleDateString()} at{' '}
                              {new Date(appointment.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            {appointment.message && (
                              <p className="italic">"{appointment.message}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              appointment.status === 'upcoming' ? 'default' : 
                              appointment.status === 'confirmed' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {appointment.status}
                          </Badge>
                          {appointment.status === 'upcoming' && (
                            <div className="space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Confirm
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{sosAlerts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {appointments.filter(a => a.status === 'upcoming').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PartnerHome;