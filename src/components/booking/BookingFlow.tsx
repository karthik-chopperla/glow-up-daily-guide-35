import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BookingFlowProps {
  type: 'doctor' | 'facility';
  item: any;
  hospitalName: string;
  onClose: () => void;
  onComplete: () => void;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];

const BookingFlow = ({ type, item, hospitalName, onClose, onComplete }: BookingFlowProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create appointment datetime
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      appointmentDateTime.setHours(hours, minutes);

      const appointmentData = {
        user_id: user?.id,
        partner_id: item.partner_id || item.hospital_id,
        doctor_name: type === 'doctor' ? item.name : `${item.name} at ${hospitalName}`,
        specialty: type === 'doctor' ? item.specialty : item.category || 'Facility',
        type: type === 'doctor' ? 'consultation' : 'facility',
        appointment_time: appointmentDateTime.toISOString(),
        message,
        status: 'upcoming',
        service_type: type === 'doctor' ? 'consultation' : 'facility'
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: `Your ${type === 'doctor' ? 'consultation' : 'facility booking'} has been scheduled for ${format(appointmentDateTime, 'PPP')} at ${selectedTime}.`
      });

      onComplete();
      onClose();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === 'doctor' ? '👨‍⚕️' : '🏥'} Book {type === 'doctor' ? 'Consultation' : 'Facility'}
        </CardTitle>
        <CardDescription>
          {type === 'doctor' 
            ? `Schedule a consultation with ${item.name}` 
            : `Book ${item.name} at ${hospitalName}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Details */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h3 className="font-medium">{item.name}</h3>
          {type === 'doctor' ? (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Specialty: {item.specialty}</p>
              <p>Experience: {item.experience_years} years</p>
              <p className="font-medium text-primary">Consultation Fee: ₹{item.consultation_price}</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{item.description}</p>
              <p className="font-medium text-primary">Price: ₹{item.price}</p>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Select Date
          </Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
            className="rounded-md border"
          />
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Select Time
          </Label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTime(time)}
                className="text-xs"
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder={type === 'doctor' 
              ? "Describe your symptoms or reason for consultation..." 
              : "Any special instructions or notes..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleBooking}
            disabled={loading || !selectedDate || !selectedTime}
            className="flex-1"
          >
            {loading ? "Booking..." : `Confirm Booking (₹${type === 'doctor' ? item.consultation_price : item.price})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingFlow;