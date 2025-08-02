
import React from "react";
import BackButton from "../components/BackButton";

const DietMeals = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-emerald-800">Diet & Meals</h1>
      <p className="text-gray-600 mb-8">Personalized meal plans and healthy food ordering made simple.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Diet and meal plans UI will go here]
      </div>
    </div>
  </div>
);

export default DietMeals;
