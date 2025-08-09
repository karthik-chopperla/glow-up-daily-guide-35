import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, MapPin, Phone, Loader2 } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone_number: string;
  distance_km: number;
}

export const EmergencySOSButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nearestDriver, setNearestDriver] = useState<Driver | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearestDriver = async (userLat: number, userLng: number) => {
    try {
      // Get all omlens drivers from profiles
      const { data: drivers, error } = await supabase
        .from('profiles')
        .select('id, name, phone_number, location_lat, location_lng')
        .eq('role', 'omlens_driver');

      if (error) throw error;

      if (!drivers || drivers.length === 0) {
        throw new Error('No ambulance drivers available');
      }

      // Calculate distances and find nearest
      const driversWithDistance = drivers
        .filter(driver => driver.location_lat && driver.location_lng)
        .map(driver => ({
          ...driver,
          distance_km: calculateDistance(
            userLat, 
            userLng, 
            driver.location_lat!, 
            driver.location_lng!
          )
        }))
        .sort((a, b) => a.distance_km - b.distance_km);

      return driversWithDistance[0] || null;
    } catch (error) {
      console.error('Error finding nearest driver:', error);
      return null;
    }
  };

  const sendSOSAlert = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use emergency services",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get user's current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      setUserLocation({ lat: userLat, lng: userLng });

      // Find nearest driver
      const nearest = await findNearestDriver(userLat, userLng);
      
      if (!nearest) {
        throw new Error('No nearby ambulance drivers found');
      }

      setNearestDriver(nearest);

      // Create SOS alert in database
      const { error: alertError } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: user.id,
          assigned_driver_id: nearest.id,
          distance_km: nearest.distance_km,
          location_lat: userLat,
          location_lng: userLng,
          status: 'pending'
        });

      if (alertError) throw alertError;

      // Create notification for the driver
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          partner_id: nearest.id,
          type: 'emergency',
          title: 'Emergency SOS Alert',
          message: `Emergency request from ${user.name || 'User'} - Distance: ${nearest.distance_km.toFixed(1)}km`,
          is_read: false
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Emergency alert sent!",
        description: `Nearest ambulance driver (${nearest.distance_km.toFixed(1)}km away) has been notified`,
      });

    } catch (error) {
      console.error('SOS Error:', error);
      toast({
        title: "Emergency alert failed",
        description: error instanceof Error ? error.message : "Unable to send emergency alert",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5" />
            <span>Emergency SOS</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-100 text-sm">
            Press the button below for immediate medical emergency assistance
          </p>
          
          <Button
            onClick={sendSOSAlert}
            disabled={isLoading}
            className="w-full bg-white text-red-600 hover:bg-red-50 font-bold py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Alert...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                SEND EMERGENCY ALERT
              </>
            )}
          </Button>

          {nearestDriver && (
            <Alert className="bg-white/10 border-white/20 text-white">
              <MapPin className="h-4 w-4" />
              <AlertDescription className="text-white">
                <div className="space-y-1">
                  <p className="font-semibold">Nearest Ambulance:</p>
                  <p>Driver: {nearestDriver.name}</p>
                  <p>Distance: {nearestDriver.distance_km.toFixed(1)} km away</p>
                  <p className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {nearestDriver.phone_number}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};