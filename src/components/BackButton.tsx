
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BackButton = ({ label = "Back" }: { label?: string }) => {
  const nav = useNavigate();
  return (
    <button onClick={() => nav(-1)} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/80 shadow text-green-700 hover:bg-green-100 transition font-medium text-md mb-4">
      <ChevronLeft size={20} /> {label}
    </button>
  );
};

export default BackButton;
