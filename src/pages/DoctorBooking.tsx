
import React, { useState } from "react";
import BackButton from "../components/BackButton";
import DoctorCard, { Doctor } from "../components/BookDoctor/DoctorCard";
import BookingModal from "../components/BookDoctor/BookingModal";
import DoctorDetailModal from "../components/BookDoctor/DoctorDetailModal";
import Filters from "../components/BookDoctor/Filters";

// --- MOCK DATA ---
const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Asha Mehra",
    specialty: "Cardiologist",
    rating: 4.7,
    availability: "Online",
    languages: ["English", "Hindi", "Marathi"],
    bio: "Experienced cardiologist with 15+ years, passionate about heart health.",
  },
  {
    id: "d2",
    name: "Dr. Rajesh Nair",
    specialty: "Dermatologist",
    rating: 4.3,
    availability: "In-person",
    languages: ["English", "Malayalam"],
    bio: "Skin care expert, specializing in acne and allergies.",
  },
  {
    id: "d3",
    name: "Dr. Sunita Gupta",
    specialty: "Pediatrician",
    rating: 4.9,
    availability: "In-person",
    languages: ["Hindi", "English", "Gujarati"],
    bio: "Loves working with children, over a decade of pediatric experience.",
  },
  {
    id: "d4",
    name: "Dr. Ajay Sharma",
    specialty: "General Physician",
    rating: 4.0,
    availability: "Online",
    languages: ["English", "Hindi"],
    bio: "General medicine, treating everyday health concerns, 8 years experience.",
  },
];
const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

// --- PAGE ---
const DoctorBooking = () => {
  const [specialty, setSpecialty] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [bookModalDoc, setBookModalDoc] = useState<Doctor|null>(null);
  const [detailModalDoc, setDetailModalDoc] = useState<Doctor|null>(null);

  // Filter logic
  const filteredDoctors = doctors.filter(d =>
    (!specialty || d.specialty === specialty) &&
    (!availability || d.availability === availability) &&
    d.rating >= minRating
  );

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="w-full max-w-md">
        <BackButton label="All Services" />
        <h1 className="text-2xl font-bold mb-1 text-purple-700">Doctor Booking</h1>
        <p className="text-gray-600 mb-4">
          Book an appointment with trusted doctors, online or in-person.<br/>
          <span className="block mt-2 text-gray-500 text-sm">
            <span role="img" aria-label="calendar">📅</span> Select a date and time that works best for you<br/>
            <span role="img" aria-label="doc">👨‍⚕️</span> Browse by specialty, ratings, or nearby availability<br/>
            <span role="img" aria-label="filter">🔍</span> Use filters like Online, In-person, or Languages spoken<br/>
            <span role="img" aria-label="review">📝</span> View doctor profiles, qualifications, and patient reviews
          </span>
        </p>

        {/* Filters */}
        <Filters
          specialty={specialty}
          setSpecialty={setSpecialty}
          minRating={minRating}
          setMinRating={setMinRating}
          availability={availability}
          setAvailability={setAvailability}
          specialties={specialties}
        />

        {/* List of doctors */}
        <div className="mb-5">
          {filteredDoctors.length === 0 && (
            <div className="text-gray-500 text-center p-6">No doctors found. Try adjusting filters.</div>
          )}
          {filteredDoctors.map(doc =>
            <DoctorCard
              key={doc.id}
              doctor={doc}
              onBook={d => setBookModalDoc(d)}
              onShowDetail={d => setDetailModalDoc(d)}
            />
          )}
        </div>
      </div>
      {/* Book modal */}
      <BookingModal
        open={!!bookModalDoc}
        onClose={() => setBookModalDoc(null)}
        doctorName={bookModalDoc?.name || ""}
      />
      {/* Doctor detail modal */}
      <DoctorDetailModal
        open={!!detailModalDoc}
        onClose={() => setDetailModalDoc(null)}
        doctor={detailModalDoc}
      />
    </div>
  );
};

export default DoctorBooking;
