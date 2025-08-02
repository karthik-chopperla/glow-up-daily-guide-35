
import React from "react";
import BackButton from "../components/BackButton";

const PregnancyBaby = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-pink-50 to-red-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-pink-700">Pregnancy & Baby</h1>
      <p className="text-gray-600 mb-8">Track your journey, book visits, and get baby care reminders.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Pregnancy/baby care UI will go here]
      </div>
    </div>
  </div>
);

export default PregnancyBaby;
