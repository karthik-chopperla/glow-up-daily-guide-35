import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SPECIALTIES = [
  'General Physician', 'Pediatrician', 'OB-GYN', 'Cardiologist', 'Neurologist',
  'Psychiatrist', 'Dermatologist', 'Ophthalmologist', 'ENT Specialist', 
  'Orthopedic Surgeon', 'Dentist', 'Pulmonologist', 'Gastroenterologist',
  'Nephrologist', 'Oncologist', 'Endocrinologist', 'Radiologist', 
  'Pathologist', 'Urologist'
];

const DoctorOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialty: '',
    education: '',
    experience_years: 0,
    consultation_price: 0,
    availability_schedule: '',
    hospital_affiliation: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.doctor_name || !formData.specialty || !formData.consultation_price) {
      toast({
        title: "Missing Information",
        description: "Name, specialty, and consultation price are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Update profile with doctor information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          doctor_name: formData.doctor_name,
          specialty: formData.specialty,
          education: formData.education,
          years_experience: formData.experience_years,
          consultation_price: formData.consultation_price,
          availability_schedule: formData.availability_schedule,
          hospital_affiliation: formData.hospital_affiliation,
          address: formData.address,
          phone: formData.phone,
          partner_setup_complete: true
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Also add to doctors table for consistency
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          partner_id: user?.id,
          name: formData.doctor_name,
          specialty: formData.specialty,
          education: formData.education,
          experience_years: formData.experience_years,
          consultation_price: formData.consultation_price,
          availability_schedule: formData.availability_schedule
        });

      if (doctorError) throw doctorError;

      toast({
        title: "Success!",
        description: "Doctor profile setup completed successfully."
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Profile Setup</CardTitle>
        <CardDescription>Complete your professional profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doctor_name">Doctor Name *</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => handleInputChange('doctor_name', e.target.value)}
              placeholder="Dr. Your Name"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Specialty *</Label>
            <Select
              value={formData.specialty}
              onValueChange={(value) => handleInputChange('specialty', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education & Qualifications</Label>
            <Input
              id="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="MBBS, MD, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_years">Years of Experience</Label>
            <Input
              id="experience_years"
              type="number"
              value={formData.experience_years}
              onChange={(e) => handleInputChange('experience_years', Number(e.target.value))}
              placeholder="Years of practice"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultation_price">Consultation Price (₹) *</Label>
            <Input
              id="consultation_price"
              type="number"
              value={formData.consultation_price}
              onChange={(e) => handleInputChange('consultation_price', Number(e.target.value))}
              placeholder="Consultation fee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hospital_affiliation">Hospital Affiliation</Label>
            <Input
              id="hospital_affiliation"
              value={formData.hospital_affiliation}
              onChange={(e) => handleInputChange('hospital_affiliation', e.target.value)}
              placeholder="Associated hospital/clinic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability_schedule">Availability Schedule</Label>
          <Textarea
            id="availability_schedule"
            value={formData.availability_schedule}
            onChange={(e) => handleInputChange('availability_schedule', e.target.value)}
            placeholder="e.g., Monday-Friday 9:00 AM - 5:00 PM, Saturday 9:00 AM - 1:00 PM"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Clinic/Practice Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Your practice address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Your contact number"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={loading || !formData.doctor_name || !formData.specialty || !formData.consultation_price}
          className="w-full"
          size="lg"
        >
          {loading ? "Setting up..." : "Complete Doctor Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DoctorOnboarding;