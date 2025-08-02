
import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  specialty: string;
  setSpecialty: (v: string) => void;
  rating: string;
  setRating: (v: string) => void;
  cost: string;
  setCost: (v: string) => void;
  specialties: string[];
  ratings: string[];
  costs: string[];
};

const HospitalFilters: React.FC<Props> = ({
  search,
  setSearch,
  specialty,
  setSpecialty,
  rating,
  setRating,
  cost,
  setCost,
  specialties,
  ratings,
  costs,
}) => {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg shadow bg-white mb-2">
      <span className="text-gray-300 px-0.5">
        <Search size={18} />
      </span>
      <Input
        placeholder="Search by hospital or specialty..."
        value={search}
        className="bg-transparent border-none flex-1"
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="bg-blue-50 px-2 py-1 rounded text-xs text-blue-700"
        value={specialty}
        onChange={e => setSpecialty(e.target.value)}
      >
        {specialties.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        className="bg-yellow-50 px-1 py-1 rounded text-xs text-yellow-700"
        value={rating}
        onChange={e => setRating(e.target.value)}
      >
        {ratings.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <select
        className="bg-teal-50 px-1 py-1 rounded text-xs text-teal-700"
        value={cost}
        onChange={e => setCost(e.target.value)}
      >
        {costs.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

export default HospitalFilters;
