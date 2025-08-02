
import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Star, User } from "lucide-react";
import { Doctor } from "./DoctorCard";

const sampleReviews = [
  { name: "Maya P.", rating: 5, comment: "Very kind and patient. Answered all my questions." },
  { name: "Rakesh T.", rating: 4, comment: "Professional and helpful, would recommend!" },
];

interface DoctorDetailModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({ open, onClose, doctor }) => {
  if (!doctor) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle>
          <div className="flex items-center gap-2">
            <User className="bg-blue-50 rounded-full text-blue-400 p-1" size={36}/>
            {doctor.name}
          </div>
        </DialogTitle>
        <div className="mb-1 font-medium text-blue-700">{doctor.specialty}</div>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={15}/> {doctor.rating.toFixed(1)}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">{doctor.availability}</span>
        </div>
        <div className="mb-2 text-sm text-gray-600">{doctor.bio}</div>
        <div className="text-[13px] font-medium mb-1">Patient Reviews:</div>
        <div className="space-y-2">
          {sampleReviews.map((r, idx) => (
            <div key={idx} className="bg-slate-50 rounded px-2 py-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">{r.name}</span>
                <span className="text-yellow-500 flex items-center gap-0.5">
                  <Star size={12}/>{r.rating}
                </span>
              </div>
              <div className="ml-1 text-xs text-gray-600">{r.comment}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDetailModal;
