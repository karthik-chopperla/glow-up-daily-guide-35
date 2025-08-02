
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const plans = [
  {
    name: "Silver",
    emoji: "💠",
    price: "₹299 /yr",
    gradient: "from-blue-100 to-blue-50",
    features: [
      "AI Health Check",
      "Hospital Search",
      "Appointment Booking",
    ],
    storage: "silver"
  },
  {
    name: "Gold",
    emoji: "🏆",
    price: "₹599 /yr",
    gradient: "from-yellow-200 via-yellow-100 to-yellow-50",
    features: [
      "All Silver features",
      "Elder Consultations",
      "SOS Button",
      "Medicine Reminders",
      "Discounts: Doctor Visits, Lab Tests, Pharmacy",
    ],
    storage: "gold"
  },
  {
    name: "Platinum",
    emoji: "👑",
    price: "₹1199 /yr",
    gradient: "from-green-200 via-blue-100 to-blue-50",
    features: [
      "All Gold benefits",
      "Pregnancy & Baby Support",
      "Home Nursing Access",
      "Insurance Support",
      "Highest Discount Tier on services"
    ],
    storage: "platinum"
  }
];

const localKey = "subscription_plan";

const SubscriptionPlans = () => {
  const nav = useNavigate();
  const [current, setCurrent] = useState(() => localStorage.getItem(localKey) || "");

  function activate(plan: string) {
    setCurrent(plan);
    localStorage.setItem(localKey, plan);
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-2 bg-gradient-to-br from-blue-50 to-white relative">
      <button className="self-start mb-2 ml-2 text-green-700 bg-white rounded-md px-3 py-1 shadow" onClick={() => nav(-1)}>← Back</button>
      <h1 className="text-2xl font-bold mb-4 text-yellow-700 text-center">🪙 Subscription Plans</h1>
      <div className="w-full max-w-md flex flex-col gap-4">
        {plans.map(plan => (
          <Card
            key={plan.name}
            className={`rounded-2xl shadow-lg p-0 overflow-hidden border-2 ${(current === plan.name.toLowerCase()) ? "border-yellow-500" : "border-transparent"} bg-gradient-to-br ${plan.gradient} transition-all`}
            style={{ opacity: current && current !== plan.name.toLowerCase() ? 0.6 : 1 }}
          >
            <CardHeader className="p-4 flex flex-col gap-0">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{plan.emoji}</span>
                <span className="font-bold text-lg">{plan.name} PLAN</span>
                <span className="bg-white/70 text-gray-800 text-xs font-semibold px-3 py-1 rounded-xl">{plan.price}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-1 pb-4">
              <ul className="text-gray-700 mb-2 text-sm list-disc pl-6">
                {plan.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <button
                className={`w-full rounded-xl font-bold py-2 mt-2 transition ${current === plan.name.toLowerCase() ? "bg-green-500 text-white" : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"}`}
                disabled={current === plan.name.toLowerCase()}
                onClick={() => activate(plan.name.toLowerCase())}
              >
                {current === plan.name.toLowerCase() ? "Active" : `Activate ${plan.name}`}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
