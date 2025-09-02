import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Calendar, MapPin, User, Clock, Search, Star, Phone, Settings, Bell, Heart, Hospital, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Use the Database types from Supabase
type Hospital = {
  id: string;
  name: string;
  address: string;
  rating?: number;
  distance?: number;
};

// For now, we'll work with the existing appointments table
// and use mock data for doctors and facilities since those tables need to be accessed
type MockDoctor = {
  id: string;
  name: string;
  specialty: string;
  experience_years: number;
  consultation_price: number;
  hospital_id: string;
};

type MockFacility = {
  id: string;
  name: string;
  price: number;
  description?: string;
  hospital_id: string;
};

const UserHome = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<MockDoctor[]>([]);
  const [facilities, setFacilities] = useState<MockFacility[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHospitals();
    fetchAppointments();
    fetchNotifications();
  }, []);

  const fetchHospitals = async () => {
    const { data } = await supabase
      .from('hospitals')
      .select('id, name, address, rating')
      .order('name');
    
    if (data) {
      const hospitalsWithDistance = data.map(hospital => ({
        ...hospital,
        distance: Math.random() * 10 + 1 // Mock distance for now
      }));
      setHospitals(hospitalsWithDistance);
    }
  };

  const fetchDoctorsByHospital = async (hospitalId: string) => {
    // Mock doctors data for now since the doctors table exists but may not have data
    const mockDoctors: MockDoctor[] = [
      {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        specialty: 'General Physician',
        experience_years: 15,
        consultation_price: 500,
        hospital_id: hospitalId
      },
      {
        id: '2',
        name: 'Dr. Priya Sharma',
        specialty: 'Cardiologist',
        experience_years: 12,
        consultation_price: 800,
        hospital_id: hospitalId
      },
      {
        id: '3',
        name: 'Dr. Amit Patel',
        specialty: 'Pediatrician',
        experience_years: 10,
        consultation_price: 600,
        hospital_id: hospitalId
      }
    ];
    setDoctors(mockDoctors);
  };

  const fetchFacilitiesByHospital = async (hospitalId: string) => {
    // Mock facilities data for now since the facilities table exists but may not have data
    const mockFacilities: MockFacility[] = [
      {
        id: '1',
        name: 'MRI Scan',
        price: 3500,
        description: 'Magnetic Resonance Imaging',
        hospital_id: hospitalId
      },
      {
        id: '2',
        name: 'Blood Test (Complete)',
        price: 800,
        description: 'Complete Blood Count with ESR',
        hospital_id: hospitalId
      },
      {
        id: '3',
        name: 'X-Ray Chest',
        price: 400,
        description: 'Chest X-Ray PA View',
        hospital_id: hospitalId
      },
      {
        id: '4',
        name: 'ECG',
        price: 200,
        description: 'Electrocardiogram',
        hospital_id: hospitalId
      }
    ];
    setFacilities(mockFacilities);
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

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) setNotifications(data);
  };

  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // For now, we'll use the existing sos_alerts table since sos_events may not exist
          const { error } = await supabase
            .from('sos_alerts')
            .insert({
              user_id: user?.id,
              location_lat: currentLocation.lat,
              location_lng: currentLocation.lng,
              status: 'active'
            });
          
          if (!error) {
            setIsSOSActive(true);
            toast({
              title: "SOS Alert Sent!",
              description: "Emergency services have been notified of your location.",
              variant: "destructive"
            });
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

  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    fetchDoctorsByHospital(hospital.id);
    fetchFacilitiesByHospital(hospital.id);
  };

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Health Mate</h1>
          <p className="text-muted-foreground">Your personal health companion</p>
        </div>

        {/* Top Actions */}
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          
          {/* Emergency SOS Button */}
          <Button 
            variant="destructive" 
            size="lg"
            onClick={handleSOS}
            disabled={isSOSActive}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5" />
            {isSOSActive ? "SOS SENT" : "EMERGENCY SOS"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Hospitals/Providers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Hospitals & Providers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by hospital name, specialty, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
              </CardContent>
            </Card>

            {/* Hospital Finder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="h-5 w-5" />
                  Hospital Finder
                </CardTitle>
                <CardDescription>
                  Find hospitals with info, rating, and distance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredHospitals.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No hospitals found
                    </p>
                  ) : (
                    filteredHospitals.slice(0, 5).map((hospital) => (
                      <div 
                        key={hospital.id} 
                        className="p-4 border rounded-lg cursor-pointer hover:bg-secondary/50"
                        onClick={() => handleHospitalSelect(hospital)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{hospital.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {hospital.address}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">{hospital.rating || 4.5}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {hospital.distance || '2.3'} km away
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selected Hospital Details */}
            {selectedHospital && (
              <>
                {/* Doctor List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      Doctors at {selectedHospital.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {doctors.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No doctors available
                        </p>
                      ) : (
                        doctors.map((doctor) => (
                          <div key={doctor.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{doctor.name}</h3>
                                <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                <p className="text-xs text-muted-foreground">
                                  {doctor.experience_years} years experience
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-lg">₹{doctor.consultation_price}</p>
                                <Button size="sm" className="mt-2">
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Facility List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Facilities at {selectedHospital.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {facilities.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                          No facilities available
                        </p>
                      ) : (
                        facilities.map((facility) => (
                          <div key={facility.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{facility.name}</h3>
                                <p className="text-sm text-muted-foreground">{facility.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-lg">₹{facility.price}</p>
                                <Button size="sm" className="mt-2">
                                  Book Test
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications & Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications & Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div key={notification.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Your Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      No appointments scheduled
                    </p>
                  ) : (
                    appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{appointment.doctor_name || 'Facility Booking'}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(appointment.appointment_time).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.appointment_time ? new Date(appointment.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </p>
                          </div>
                          <Badge variant={appointment.status === 'upcoming' ? 'default' : 'secondary'} className="text-xs">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;