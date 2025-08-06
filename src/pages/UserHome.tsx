import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Calendar, MapPin, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Partner {
  id: string;
  full_name: string;
  partner_type: string;
  address: string;
}

interface Appointment {
  id: string;
  doctor_name: string;
  appointment_time: string;
  status: string;
  specialty: string;
  type: string;
  message?: string;
}

const UserHome = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string>("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentMessage, setAppointmentMessage] = useState("");
  const [isSOSDialogOpen, setIsSOSDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPartners();
    fetchAppointments();
  }, []);

  const fetchPartners = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, partner_type, address')
      .eq('role', 'partner');
    
    if (data) setPartners(data);
  };

  const fetchAppointments = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', user.id)
      .order('appointment_time', { ascending: true });
    
    if (data) setAppointments(data);
  };

  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(currentLocation);
          
          // Find nearest hospital
          const hospitals = partners.filter(p => p.partner_type === 'hospital');
          const nearestHospital = hospitals[0]; // Simplified - in real app, calculate distance
          
          // Create SOS alert
          const { error } = await supabase
            .from('sos_alerts')
            .insert({
              user_id: user?.id,
              location_lat: currentLocation.lat,
              location_lng: currentLocation.lng,
              nearest_partner_id: nearestHospital?.id,
              status: 'active'
            });
          
          if (!error) {
            toast({
              title: "SOS Alert Sent!",
              description: "Emergency services have been notified of your location.",
              variant: "destructive"
            });
            setIsSOSDialogOpen(false);
          }
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your location for SOS alert.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedPartner || !appointmentDate || !appointmentTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const partner = partners.find(p => p.id === selectedPartner);
    if (!partner) return;

    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    
    const { error } = await supabase
      .from('appointments')
      .insert({
        user_id: user?.id,
        partner_id: selectedPartner,
        doctor_name: partner.full_name,
        specialty: partner.partner_type,
        type: 'consultation',
        appointment_time: appointmentDateTime.toISOString(),
        message: appointmentMessage,
        status: 'upcoming'
      });
    
    if (!error) {
      toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${partner.full_name} has been scheduled.`,
      });
      setIsBookingDialogOpen(false);
      setSelectedPartner("");
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentMessage("");
      fetchAppointments();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Health Mate</h1>
          <p className="text-muted-foreground">Your personal health companion</p>
        </div>

        {/* SOS Emergency Button */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency SOS
            </CardTitle>
            <CardDescription>
              In case of emergency, press the SOS button to alert nearby hospitals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isSOSDialogOpen} onOpenChange={setIsSOSDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="lg" className="w-full">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  EMERGENCY SOS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Emergency SOS Alert</DialogTitle>
                  <DialogDescription>
                    This will send your location to nearby hospitals and emergency services.
                    Are you sure you want to continue?
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsSOSDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleSOS} className="flex-1">
                    Send SOS Alert
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Book Appointment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Book Doctor Appointment
            </CardTitle>
            <CardDescription>
              Schedule an appointment with available healthcare partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Book Appointment</DialogTitle>
                  <DialogDescription>
                    Fill in the details to schedule your appointment
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner">Select Doctor/Hospital</Label>
                    <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a healthcare partner" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.full_name} - {partner.partner_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your symptoms or reason for visit..."
                      value={appointmentMessage}
                      onChange={(e) => setAppointmentMessage(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleBookAppointment} className="flex-1">
                      Book Appointment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Your Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No appointments scheduled
              </p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{appointment.doctor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.appointment_time).toLocaleDateString()} at{' '}
                          {new Date(appointment.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserHome;