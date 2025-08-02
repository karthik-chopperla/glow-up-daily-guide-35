
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import FabSOS from "../components/ui/FabSOS";

const features = [
  { label: "Symptom Checker", url: "/symptom-checker", color: "from-blue-100 to-green-200" },
  { label: "Elders' Home Remedies", url: "/remedies", color: "from-orange-100 to-yellow-200" },
  { label: "Hospitals Near Me", url: "/hospitals", color: "from-teal-100 to-cyan-200" },
  { label: "Doctor Booking", url: "/doctor-booking", color: "from-purple-100 to-blue-200" },
  { label: "Medicine Reminders", url: "/medicine-reminders", color: "from-purple-100 to-pink-200" },
  { label: "Mental Well-Being", url: "/mental", color: "from-green-100 to-blue-200" },
  { label: "Home Nursing", url: "/nursing", color: "from-yellow-100 to-orange-200" },
  { label: "Diet & Meals", url: "/diet-meals", color: "from-green-100 to-emerald-200" },
  { label: "Pregnancy & Baby", url: "/pregnancy-baby", color: "from-pink-100 to-red-200" },
  { label: "Fitness & Recovery", url: "/fitness", color: "from-blue-50 to-rose-100" },
  { label: "Insurance", url: "/insurance", color: "from-yellow-50 to-lime-100" },
  { label: "My Records", url: "/records", color: "from-gray-100 to-blue-100" },
];

const Dashboard = () => {
  const nav = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col pb-24">
      <header className="px-6 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-green-700 mb-1">Welcome {user?.name || "User"} 🌿</h1>
        <p className="text-gray-600">Your health at a glance. Select a service below:</p>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-4">
        {features.map(f => (
          <button
            key={f.label}
            className={`rounded-2xl shadow-md bg-gradient-to-r ${f.color} py-6 px-4 font-bold text-lg text-gray-700 hover:scale-105 transition-all outline-none`}
            onClick={() => nav(f.url)}
          >{f.label}</button>
        ))}
        <button
          className="rounded-2xl shadow-md bg-gradient-to-r from-blue-200 to-purple-200 py-6 px-4 font-bold text-lg text-gray-700 hover:scale-105 transition-all outline-none"
          onClick={() => nav("/chatbot")}
        >AI Health Chatbot 🤖</button>
      </main>
      <FabSOS />
    </div>
  );
};

export default Dashboard;
// ... Dashboard page: links to all main features and chatbot
