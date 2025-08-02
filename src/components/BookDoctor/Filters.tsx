
import React from "react";

interface FiltersProps {
  specialty: string;
  setSpecialty: (s: string) => void;
  minRating: number;
  setMinRating: (r: number) => void;
  availability: string;
  setAvailability: (a: string) => void;
  specialties: string[];
}

const Filters: React.FC<FiltersProps> = ({
  specialty, setSpecialty,
  minRating, setMinRating,
  availability, setAvailability,
  specialties
}) => (
  <div className="bg-white rounded-lg p-3 mb-3 flex flex-wrap gap-2 shadow border items-end">
    <div className="flex flex-col mr-4">
      <label className="text-xs text-gray-500 mb-1">Specialty</label>
      <select className="p-1 border rounded" value={specialty} onChange={e => setSpecialty(e.target.value)}>
        <option value="">All</option>
        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
    <div className="flex flex-col mr-4 min-w-[90px]">
      <label className="text-xs text-gray-500 mb-1">Min. Rating</label>
      <select className="p-1 border rounded" value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
        {[0, 3, 4].map(r => (
          <option key={r} value={r}>{r === 0 ? "Any" : r + "+"}</option>
        ))}
      </select>
    </div>
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">Availability</label>
      <select className="p-1 border rounded" value={availability} onChange={e => setAvailability(e.target.value)}>
        <option value="">All</option>
        <option>Online</option>
        <option>In-person</option>
      </select>
    </div>
  </div>
);

export default Filters;
