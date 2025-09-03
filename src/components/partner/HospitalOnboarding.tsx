import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X } from 'lucide-react';

const SPECIALTIES = [
  'General Physician', 'Pediatrician', 'OB-GYN', 'Cardiologist', 'Neurologist',
  'Psychiatrist', 'Dermatologist', 'Ophthalmologist', 'ENT Specialist', 
  'Orthopedic Surgeon', 'Dentist', 'Pulmonologist', 'Gastroenterologist',
  'Nephrologist', 'Oncologist', 'Endocrinologist', 'Radiologist', 
  'Pathologist', 'Urologist'
];

interface Doctor {
  name: string;
  specialty: string;
  education: string;
  experience_years: number;
  consultation_price: number;
  availability_schedule: string;
}

interface Facility {
  name: string;
  description: string;
  price: number;
  category: string;
}

const HospitalOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [hospitalName, setHospitalName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>({
    name: '',
    specialty: '',
    education: '',
    experience_years: 0,
    consultation_price: 0,
    availability_schedule: ''
  });
  const [currentFacility, setCurrentFacility] = useState<Facility>({
    name: '',
    description: '',
    price: 0,
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addDoctor = () => {
    if (!currentDoctor.name || !currentDoctor.specialty || !currentDoctor.consultation_price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required doctor fields.",
        variant: "destructive"
      });
      return;
    }
    setDoctors([...doctors, currentDoctor]);
    setCurrentDoctor({
      name: '',
      specialty: '',
      education: '',
      experience_years: 0,
      consultation_price: 0,
      availability_schedule: ''
    });
  };

  const removeDoctor = (index: number) => {
    setDoctors(doctors.filter((_, i) => i !== index));
  };

  const addFacility = () => {
    if (!currentFacility.name || !currentFacility.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in facility name and price.",
        variant: "destructive"
      });
      return;
    }
    setFacilities([...facilities, currentFacility]);
    setCurrentFacility({
      name: '',
      description: '',
      price: 0,
      category: ''
    });
  };

  const removeFacility = (index: number) => {
    setFacilities(facilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!hospitalName || !address || doctors.length === 0) {
      toast({
        title: "Missing Information",
        description: "Hospital name, address, and at least one doctor are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Update profile with hospital information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          hospital_name: hospitalName,
          address,
          phone,
          partner_setup_complete: true
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Insert doctors
      const doctorInserts = doctors.map(doctor => ({
        ...doctor,
        partner_id: user?.id
      }));

      const { error: doctorsError } = await supabase
        .from('doctors')
        .insert(doctorInserts);

      if (doctorsError) throw doctorsError;

      // Insert facilities if any
      if (facilities.length > 0) {
        const facilityInserts = facilities.map(facility => ({
          ...facility,
          partner_id: user?.id
        }));

        const { error: facilitiesError } = await supabase
          .from('facilities')
          .insert(facilityInserts);

        if (facilitiesError) throw facilitiesError;
      }

      toast({
        title: "Success!",
        description: "Hospital setup completed successfully."
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
    <div className="space-y-6">
      {/* Hospital Information */}
      <Card>
        <CardHeader>
          <CardTitle>Hospital Information</CardTitle>
          <CardDescription>Basic details about your hospital</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hospitalName">Hospital Name *</Label>
            <Input
              id="hospitalName"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Enter hospital name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter hospital address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Doctors */}
      <Card>
        <CardHeader>
          <CardTitle>Add Doctors</CardTitle>
          <CardDescription>Add doctors working at your hospital (at least one required)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Doctor Name *</Label>
              <Input
                value={currentDoctor.name}
                onChange={(e) => setCurrentDoctor({...currentDoctor, name: e.target.value})}
                placeholder="Enter doctor name"
              />
            </div>
            <div className="space-y-2">
              <Label>Specialty *</Label>
              <Select
                value={currentDoctor.specialty}
                onValueChange={(value) => setCurrentDoctor({...currentDoctor, specialty: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
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
              <Label>Education</Label>
              <Input
                value={currentDoctor.education}
                onChange={(e) => setCurrentDoctor({...currentDoctor, education: e.target.value})}
                placeholder="Medical qualifications"
              />
            </div>
            <div className="space-y-2">
              <Label>Experience (Years)</Label>
              <Input
                type="number"
                value={currentDoctor.experience_years}
                onChange={(e) => setCurrentDoctor({...currentDoctor, experience_years: Number(e.target.value)})}
                placeholder="Years of experience"
              />
            </div>
            <div className="space-y-2">
              <Label>Consultation Price (₹) *</Label>
              <Input
                type="number"
                value={currentDoctor.consultation_price}
                onChange={(e) => setCurrentDoctor({...currentDoctor, consultation_price: Number(e.target.value)})}
                placeholder="Consultation fee"
              />
            </div>
            <div className="space-y-2">
              <Label>Availability Schedule</Label>
              <Input
                value={currentDoctor.availability_schedule}
                onChange={(e) => setCurrentDoctor({...currentDoctor, availability_schedule: e.target.value})}
                placeholder="e.g., Mon-Fri 9AM-5PM"
              />
            </div>
          </div>
          <Button onClick={addDoctor} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
          
          {doctors.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Added Doctors:</h4>
              {doctors.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialty} • ₹{doctor.consultation_price}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeDoctor(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Facilities */}
      <Card>
        <CardHeader>
          <CardTitle>Add Facilities (Optional)</CardTitle>
          <CardDescription>Add medical facilities and services offered</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Facility Name</Label>
              <Input
                value={currentFacility.name}
                onChange={(e) => setCurrentFacility({...currentFacility, name: e.target.value})}
                placeholder="e.g., MRI Scan"
              />
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                value={currentFacility.price}
                onChange={(e) => setCurrentFacility({...currentFacility, price: Number(e.target.value)})}
                placeholder="Service price"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={currentFacility.category}
                onChange={(e) => setCurrentFacility({...currentFacility, category: e.target.value})}
                placeholder="e.g., Diagnostic"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={currentFacility.description}
                onChange={(e) => setCurrentFacility({...currentFacility, description: e.target.value})}
                placeholder="Brief description"
              />
            </div>
          </div>
          <Button onClick={addFacility} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Facility
          </Button>
          
          {facilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Added Facilities:</h4>
              {facilities.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{facility.name}</p>
                    <p className="text-sm text-muted-foreground">₹{facility.price}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFacility(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={handleSubmit}
        disabled={loading || !hospitalName || !address || doctors.length === 0}
        className="w-full"
        size="lg"
      >
        {loading ? "Setting up..." : "Complete Hospital Setup"}
      </Button>
    </div>
  );
};

export default HospitalOnboarding;