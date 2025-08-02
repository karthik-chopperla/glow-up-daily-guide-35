
import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import FabSOS from "../components/ui/FabSOS";
import { Hospital, Star, Map, Search, Filter, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import HospitalCard from "../components/HospitalCard";
import HospitalFilters from "../components/HospitalFilters";
import HospitalMap from "../components/HospitalMap";

type HospitalData = {
  id: string;
  name: string;
  rating: number;
  distance: number; // in km
  services: string[];
  price: string;
  phone: string;
  specialty: string;
  insurance?: string[];
  lat: number;
  lng: number;
};

const MOCK_HOSPITALS: HospitalData[] = [
  {
    id: "1",
    name: "City Care Hospital",
    rating: 4.3,
    distance: 1.5,
    services: ["24/7 Emergency", "ICU", "Pharmacy"],
    price: "₹₹",
    phone: "9876543210",
    specialty: "General",
    lat: 19.0738,
    lng: 72.8777,
    insurance: ["MediAssist"],
  },
  {
    id: "2",
    name: "Sunshine Multispecialty",
    rating: 4.8,
    distance: 2.1,
    services: ["ICU", "Cardiology", "MRI"],
    price: "₹₹₹",
    phone: "9123456789",
    specialty: "Cardiology",
    lat: 19.0758,
    lng: 72.8760,
    insurance: ["Star Health"],
  },
  {
    id: "3",
    name: "Lotus Health Center",
    rating: 3.9,
    distance: 3.2,
    services: ["Orthopedics", "Pediatrics"],
    price: "₹₹",
    phone: "9999911111",
    specialty: "Orthopedics",
    lat: 19.07,
    lng: 72.8700,
  },
  // Add more as needed
];

const SPECIALTIES = [
  "All",
  "General",
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Oncology",
];

const RATINGS = ["All", "4+", "3+", "2+"];

const COSTS = ["All", "₹", "₹₹", "₹₹₹"];

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  // Haversine formula, returns distance in kilometers
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(1);
};

const Hospitals = () => {
  // State for location
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pincode, setPincode] = useState("");
  const [locationDenied, setLocationDenied] = useState(false);

  // Hospital data & filters
  const [hospitals, setHospitals] = useState<HospitalData[]>(MOCK_HOSPITALS);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [rating, setRating] = useState("All");
  const [cost, setCost] = useState("All");
  const [mapView, setMapView] = useState(false);

  // Fetch location on first load
  useEffect(() => {
    if (coords || locationDenied) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationDenied(true)
      );
    } else {
      setLocationDenied(true);
    }
  }, [coords, locationDenied]);

  // Example: update mock data distance based on user location (simulate)
  useEffect(() => {
    if (!coords) return;
    setHospitals((prev) =>
      prev.map((h) => ({
        ...h,
        distance: getDistance(coords.lat, coords.lng, h.lat, h.lng),
      }))
    );
  }, [coords]);

  // Filtering logic
  const filtered = hospitals.filter((h) => {
    // Search
    if (search && !h.name.toLowerCase().includes(search.toLowerCase()) && !h.specialty.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Specialty
    if (specialty !== "All" && h.specialty !== specialty) {
      return false;
    }
    // Rating
    if (rating === "4+" && h.rating < 4) return false;
    if (rating === "3+" && h.rating < 3) return false;
    if (rating === "2+" && h.rating < 2) return false;
    // Cost
    if (cost !== "All" && h.price !== cost) return false;
    return true;
  });

  // Manual location set via pincode (simulate location)
  const handleManualLocation = () => {
    // For demo, set a location for pincode '400001'
    if (pincode === "400001") {
      setCoords({ lat: 18.9388, lng: 72.8354 });
      setLocationDenied(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col pb-24 relative">
      <div className="w-full max-w-md mx-auto pt-4 px-1">
        {/* Navigation */}
        <BackButton label="All Services" />

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
            <Hospital className="text-teal-400" size={28} /> Hospitals Near Me
          </h1>
          <button
            className={`rounded-full p-2 shadow bg-white text-teal-500 hover:bg-teal-50 ml-2 flex items-center justify-center transition ${mapView ? "bg-teal-100" : ""}`}
            onClick={() => setMapView((v) => !v)}
            aria-label="Toggle Map View"
            title="Map View"
          >
            <Map size={22} />
          </button>
        </div>

        <p className="text-gray-600 mb-2 mt-1">Find the best hospitals around you with ratings and services.</p>

        {/* Ask for location or show pincode input if denied */}
        {locationDenied && (
          <div className="mb-4 bg-fuchsia-50 rounded-lg p-3 flex items-center gap-2">
            <span className="text-red-500">📍</span>
            <span className="flex-1 text-sm text-gray-700">Location access denied. Enter Pincode to see hospitals nearby:</span>
            <Input
              type="tel"
              maxLength={6}
              placeholder="Pincode"
              className="max-w-[90px] ml-2"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleManualLocation()}
            />
            <button className="ml-1 px-2 rounded bg-teal-500 text-white hover:bg-teal-600 text-xs" onClick={handleManualLocation}>OK</button>
          </div>
        )}

        {/* Search & filter bar */}
        <HospitalFilters
          search={search}
          setSearch={setSearch}
          specialty={specialty}
          setSpecialty={setSpecialty}
          rating={rating}
          setRating={setRating}
          cost={cost}
          setCost={setCost}
          specialties={SPECIALTIES}
          ratings={RATINGS}
          costs={COSTS}
        />

        {/* Map view */}
        {mapView ? (
          <div className="mt-6 mb-10 rounded-xl overflow-hidden">
            <HospitalMap coords={coords} hospitals={filtered} />
          </div>
        ) : (
          <div className="py-1 rounded-lg mb-10">
            {/* Hospital List */}
            <div className="flex flex-col gap-5">
              {filtered.length ? (
                filtered.map((h) => <HospitalCard key={h.id} data={h} />)
              ) : (
                <div className="p-6 text-center text-gray-500 border rounded-lg shadow bg-white mt-6">
                  No hospitals found in this area.<br />Try expanding your search radius or changing filters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <FabSOS />
    </div>
  );
};

export default Hospitals;

