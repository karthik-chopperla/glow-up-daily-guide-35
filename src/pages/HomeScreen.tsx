
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Brain, FileText, User } from "lucide-react";

const features = [
  {
    label: "Symptom Checker",
    icon: <Heart className="text-green-500" size={28} />,
    to: "/symptom-checker",
    emoji: "🤒",
  },
  {
    label: "Elder Health Advice",
    icon: <User className="text-orange-400" size={28} />,
    to: "/remedies",
    emoji: "👵",
    subtitle: "Trusted remedies & wisdom from experienced elders",
  },
  {
    label: "Health Chatbot",
    icon: <MessageCircle className="text-purple-400" size={28} />,
    to: "/chatbot",
    emoji: "🤖",
  },
  // Removed Records card from the homepage as requested.
  // {
  //   label: "Records",
  //   icon: <FileText className="text-blue-500" size={28} />,
  //   to: "/records",
  //   emoji: "📁",
  // },
];

const HomeScreen = () => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col pb-24">
      <header className="px-6 pt-10 pb-6 text-center">
        <h1 className="text-2xl font-extrabold text-green-700 mb-2 font-sans tracking-tight">👋 Welcome to Health Mate!</h1>
        <p className="text-base text-gray-600 mb-6">Your health, one tap away.</p>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-sm mb-6">
          {features.map((f) => (
            <button
              key={f.label}
              className="rounded-xl shadow-md bg-white flex flex-col items-center p-6 justify-center gap-2 hover:bg-green-50 transition-all font-medium text-gray-800 active:scale-95"
              onClick={() => nav(f.to)}
            >
              <span className="text-3xl">{f.emoji}</span>
              <span className="mt-2 text-lg">{f.label}</span>
              {f.subtitle && (
                <span className="text-xs text-gray-500 text-center leading-snug mt-1" style={{ maxWidth: 130 }}>
                  {f.subtitle}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold rounded-2xl py-3 px-7 text-lg shadow-lg active:scale-95 hover:from-green-400/80 hover:to-blue-400/80 transition-all"
          onClick={() => nav("/services")}
        >
          <span role="img" aria-label="Search" className="mr-2">🔍</span>
          View All Services
        </button>
      </main>
    </div>
  );
};

export default HomeScreen;

