
import React from "react";
import { Star, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
};

const HospitalCard = ({ data }: { data: HospitalData }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">{data.name}</h2>
          <div className="flex gap-2 items-center mt-1">
            <span className="flex items-center gap-0.5 text-sm text-yellow-500">
              <Star className="inline-block mb-0.5" size={15} />
              {data.rating}
            </span>
            <span className="text-xs text-gray-400 ml-1">{data.distance} km</span>
            <span className="text-xs ml-3 bg-teal-100 text-teal-700 px-2 rounded">{data.specialty}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-500">Starting: {data.price}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mt-1">
        {data.services.map((s) => (
          <span key={s} className="bg-blue-50 text-blue-400 px-2 py-0.5 rounded-full text-xs">{s}</span>
        ))}
        {data.insurance && data.insurance.length > 0 && (
          <span className="bg-pink-50 text-pink-400 px-2 py-0.5 rounded-full text-xs">
            Insurance Accepted
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center gap-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          asChild
        >
          <a href={`tel:${data.phone}`}>
            <Phone size={16} /> Call
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center gap-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          asChild
        >
          <a href="/doctor-booking">
            <ArrowRight size={16} /> Book Appointment
          </a>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-1 px-3"
          asChild
        >
          <a href="#">
            <ArrowRight size={16} /> View Details
          </a>
        </Button>
      </div>
    </div>
  );
};

export default HospitalCard;
