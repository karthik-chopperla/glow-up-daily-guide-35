import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Brain,
  FileText,
  Home,
  User,
  Hospital,
  Activity,
  Syringe,
  Apple,
  Baby,
  Dumbbell,
  ShieldCheck,
  Search,
} from "lucide-react";

const services = [
  { label: "Symptom Checker", icon: <Heart className="text-green-500" size={28} />, to: "/symptom-checker" },
  { label: "Home Remedies", icon: <Home className="text-orange-400" size={28} />, to: "/remedies" },
  { label: "Hospital Finder", icon: <Hospital className="text-teal-500" size={28} />, to: "/hospitals" },
  { label: "Doctor Booking", icon: <User className="text-purple-500" size={28} />, to: "/doctor-booking" },
  { label: "Medicine Reminders", icon: <Syringe className="text-pink-400" size={28} />, to: "/medicine-reminders" },
  // Add: Mental Health Support
  { label: "Mental Health Support", icon: <Brain className="text-blue-400" size={28} />, to: "/mental-health-support", emoji: "🧠" },
  // Add: Home Nursing
  { label: "Home Nursing", icon: <Activity className="text-yellow-400" size={28} />, to: "/home-nursing-booking", emoji: "👩‍⚕️" },
  // Add: Pregnancy Care Plan
  { label: "Pregnancy Care Plan", icon: <Baby className="text-pink-300" size={28} />, to: "/pregnancy-care-plan", emoji: "🤰" },
  { label: "Diet Plans", icon: <Apple className="text-emerald-600" size={28} />, to: "/diet-meals" },
  { label: "Fitness Recovery", icon: <Dumbbell className="text-blue-300" size={28} />, to: "/fitness" },
  { label: "Health Insurance", icon: <ShieldCheck className="text-lime-500" size={28} />, to: "/insurance" },
  { label: "My Records", icon: <FileText className="text-blue-500" size={28} />, to: "/records" },
  { label: "AI Chatbot", icon: <MessageCircle className="text-purple-400" size={28} />, to: "/chatbot" },
  { label: "Find Food", icon: <Search className="text-orange-400" size={28} />, to: "/find-food" },
  // Add the Subscription Plans card (new)
  { label: "Subscription Plans", icon: <span className="text-yellow-400" style={{fontSize: 28}}>🪙</span>, to: "/subscription-plans", emoji: "🪙" }
];

const ServicesScreen = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white flex flex-col pb-24">
      <header className="flex items-center p-4">
        <button onClick={() => nav(-1)} className="mr-2 px-3 py-1 rounded-lg bg-white/80 shadow text-green-700 hover:bg-green-100 transition font-medium text-md">← Back</button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">All Services</h1>
      </header>
      <main className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 py-4 max-w-md mx-auto">
          {services.map((s) => (
            <button
              key={s.label}
              className="rounded-xl bg-white p-3 flex flex-col items-center shadow hover:bg-blue-50 transition-all font-semibold text-gray-700 text-sm sm:text-base active:scale-95 min-h-[90px]"
              onClick={() => nav(s.to)}
            >
              {s.icon}
              <span className="mt-2 text-[13px] leading-tight text-center">{s.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ServicesScreen;
