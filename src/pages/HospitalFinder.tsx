import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  Phone, 
  Star, 
  Bed, 
  Calendar,
  Search,
  Filter,
  ArrowLeft,
  Clock,
  Navigation,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import HospitalMap from '@/components/HospitalMap';

interface Hospital {
  id: string;
  name: string;
  location_lat: number;
  location_lng: number;
  address: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  specialties: string[];
  total_beds: number;
  available_beds: number;
  emergency_beds: number;
  rating: number;
  contact_info: any;
  facilities: string[];
  distance_km?: number;
}

interface HospitalBed {
  id: string;
  hospital_id: string;
  bed_type: string;
  total_count: number;
  available_count: number;
}

const HospitalFinder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [hospitalBeds, setHospitalBeds] = useState<Record<string, HospitalBed[]>>({});
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const specialties = [
    'Emergency',
    'Cardiology', 
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Neurology',
    'Dermatology',
    'Oncology',
    'General Medicine'
  ];

  useEffect(() => {
    loadHospitals();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    filterHospitals();
  }, [hospitals, searchQuery, selectedSpecialty, selectedRating]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Bangalore coordinates
          setUserLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const loadHospitals = async () => {
    try {
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (hospitalError) throw hospitalError;

      const { data: bedData, error: bedError } = await supabase
        .from('hospital_beds')
        .select('*');

      if (bedError) throw bedError;

      // Group beds by hospital_id
      const bedsGrouped = bedData?.reduce((acc, bed) => {
        if (!acc[bed.hospital_id]) {
          acc[bed.hospital_id] = [];
        }
        acc[bed.hospital_id].push(bed);
        return acc;
      }, {} as Record<string, HospitalBed[]>) || {};

      setHospitalBeds(bedsGrouped);

      // Calculate distances if user location is available
      const hospitalsWithDistance = hospitalData?.map(hospital => ({
        ...hospital,
        specialties: Array.isArray(hospital.specialties) 
          ? hospital.specialties.map(s => String(s)) 
          : [],
        facilities: Array.isArray(hospital.facilities) 
          ? hospital.facilities.map(f => String(f)) 
          : [],
        distance_km: userLocation ? 
          calculateDistance(userLocation.lat, userLocation.lng, hospital.location_lat, hospital.location_lng) : 
          undefined
      })) || [];

      // Sort by distance if available, otherwise by name
      hospitalsWithDistance.sort((a, b) => {
        if (a.distance_km !== undefined && b.distance_km !== undefined) {
          return a.distance_km - b.distance_km;
        }
        return a.name.localeCompare(b.name);
      });

      setHospitals(hospitalsWithDistance);
    } catch (error) {
      console.error('Error loading hospitals:', error);
      toast({
        title: "Error",
        description: "Failed to load hospitals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterHospitals = () => {
    let filtered = hospitals;

    if (searchQuery) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(hospital =>
        hospital.specialties.some(specialty => 
          specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
        )
      );
    }

    if (selectedRating) {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter(hospital => hospital.rating >= minRating);
    }

    setFilteredHospitals(filtered);
  };

  const bookAppointment = async (hospital: Hospital, appointmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user?.id,
          hospital_id: hospital.id,
          doctor_name: appointmentData.doctor,
          specialty: appointmentData.specialty,
          appointment_time: appointmentData.datetime,
          type: 'hospital_visit',
          status: 'upcoming',
          notes: appointmentData.notes,
          consultation_type: 'in_person'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Appointment Booked",
        description: `Your appointment at ${hospital.name} has been confirmed`,
        duration: 5000
      });

      setIsBookingDialogOpen(false);
      setSelectedHospital(null);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment",
        variant: "destructive"
      });
    }
  };

  const HospitalCard = ({ hospital }: { hospital: Hospital }) => {
    const beds = hospitalBeds[hospital.id] || [];
    const totalAvailable = beds.reduce((sum, bed) => sum + bed.available_count, 0);

    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{hospital.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{hospital.rating}</span>
                </div>
                {hospital.distance_km && (
                  <span className="text-sm text-muted-foreground">
                    {hospital.distance_km.toFixed(1)} km away
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{hospital.address}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4 text-green-600" />
                  <span>{totalAvailable} beds available</span>
                </div>
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-4 w-4 text-blue-600" />
                  <span>{hospital.specialties.slice(0, 2).join(', ')}</span>
                  {hospital.specialties.length > 2 && (
                    <span className="text-muted-foreground">+{hospital.specialties.length - 2}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedHospital(hospital);
                  setIsBookingDialogOpen(true);
                }}
              >
                Book Appointment
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`tel:${hospital.phone}`)}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {hospital.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const AppointmentBookingForm = () => {
    const [formData, setFormData] = useState({
      doctor: '',
      specialty: '',
      datetime: '',
      notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedHospital) {
        bookAppointment(selectedHospital, formData);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Doctor</label>
          <Input
            value={formData.doctor}
            onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
            placeholder="Dr. Name (optional)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Specialty</label>
          <Select
            value={formData.specialty}
            onValueChange={(value) => setFormData({ ...formData, specialty: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty.toLowerCase()}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Date & Time</label>
          <Input
            type="datetime-local"
            value={formData.datetime}
            onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Symptoms or additional information"
          />
        </div>
        
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            Confirm Booking
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsBookingDialogOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Find Hospitals</h1>
                <p className="text-sm text-muted-foreground">
                  {filteredHospitals.length} hospitals found
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                Map
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Specialties</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty.toLowerCase()}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Rating</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="2">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialty('');
                  setSelectedRating('');
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {viewMode === 'list' ? (
          <div className="space-y-4">
            {filteredHospitals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">No hospitals found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital.id} hospital={hospital} />
              ))
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <HospitalMap 
                coords={userLocation}
                hospitals={filteredHospitals.map(h => ({
                  id: h.id,
                  name: h.name,
                  lat: h.location_lat,
                  lng: h.location_lng
                }))}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedHospital?.name} • {selectedHospital?.address}
            </DialogDescription>
          </DialogHeader>
          <AppointmentBookingForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HospitalFinder;