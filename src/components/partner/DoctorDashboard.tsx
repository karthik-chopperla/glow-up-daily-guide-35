import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User } from "lucide-react";

interface DoctorDashboardProps {
  user: any;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user }) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availability, setAvailability] = useState("");

  useEffect(() => {
    loadAppointments();
    
    // Real-time subscription for new appointments
    const channel = supabase
      .channel('doctor-appointments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments',
          filter: `partner_id=eq.${user.id}`
        },
        (payload) => {
          setAppointments(prev => [payload.new, ...prev]);
          toast({
            title: "New Appointment!",
            description: `New appointment booked by ${payload.new.doctor_name}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user.id]);

  const loadAppointments = async () => {
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('partner_id', user.id)
      .order('appointment_time', { ascending: true });
    setAppointments(data || []);
  };

  const updateAvailability = async () => {
    const { error } = await supabase
      .from('profiles')
      .update({ availability_schedule: availability })
      .eq('id', user.id);

    if (!error) {
      toast({
        title: "Availability Updated",
        description: "Your availability schedule has been updated.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{appointment.doctor_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {appointment.specialty} - {appointment.service_type}
                      </p>
                      <p className="text-sm">
                        {new Date(appointment.appointment_time).toLocaleString()}
                      </p>
                      {appointment.message && (
                        <p className="text-sm mt-2">{appointment.message}</p>
                      )}
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  No appointments scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Availability Schedule</Label>
                <Textarea
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g., Mon-Fri 9AM-5PM, Sat 9AM-1PM"
                  rows={3}
                />
              </div>
              <Button onClick={updateAvailability} className="w-full">
                Update Availability
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};