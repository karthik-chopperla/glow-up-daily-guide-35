
import { Home, Layers, MessageCircle, FileText, User } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "services", label: "Services", icon: Layers, path: "/services" },
  { id: "chatbot", label: "Chatbot", icon: MessageCircle, path: "/chatbot" },
  { id: "records", label: "Records", icon: FileText, path: "/records" },
  { id: "profile", label: "Profile", icon: User, path: "/profile" },
];

import { useLocation, useNavigate } from "react-router-dom";

const BottomTabNav = () => {
  const loc = useLocation();
  const nav = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-md py-2 rounded-t-xl border-t border-green-100">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = loc.pathname === tab.path;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center px-2 py-1 ${isActive ? "text-green-700 font-bold" : "text-gray-500"} focus:outline-none`}
              onClick={() => nav(tab.path)}
            >
              <Icon size={22} />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabNav;
