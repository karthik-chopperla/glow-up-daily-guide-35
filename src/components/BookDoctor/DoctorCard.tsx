
import React from "react";
import { Star, Video, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  availability: "Online" | "In-person";
  languages: string[];
  bio: string;
};

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
  onShowDetail: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook, onShowDetail }) => (
  <div className="bg-white rounded-xl shadow hover:shadow-lg p-4 flex items-center gap-4 cursor-pointer border transition mb-2"
    onClick={() => onShowDetail(doctor)}
    tabIndex={0}
    aria-label={`View details for Dr. ${doctor.name}`}>
    <div className="flex flex-col items-center mr-2">
      <User className="bg-blue-50 text-blue-400 rounded-full p-1 mb-1" size={40} />
      <span className="text-sm font-medium text-gray-700">{doctor.specialty}</span>
    </div>
    <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
      <span className="font-semibold text-md text-gray-900">{doctor.name}</span>
      <div className="flex items-center gap-2 text-xs mt-1">
        <span className="flex items-center gap-1 text-yellow-500">
          <Star size={14} className="inline" /> {doctor.rating.toFixed(1)}
        </span>
        <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700">{doctor.availability}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1 truncate">
        {doctor.languages?.join(", ")}
      </div>
      <Button
        size="sm"
        className="mt-2"
        onClick={e => {
          e.stopPropagation();
          onBook(doctor);
        }}
      >
        <Calendar className="mr-1" size={16}/> Book Now
      </Button>
    </div>
  </div>
);

export type { Doctor };
export default DoctorCard;
