
import React from "react";
import BackButton from "../components/BackButton";

const MentalWellBeing = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-blue-50 to-purple-100">
    <div className="w-full max-w-md">
      <BackButton label="Home" />
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Mental Well-Being</h1>
      <p className="text-gray-600 mb-8">Take care of your mental health, book therapy, and chat for support.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Mental health support UI will go here]
      </div>
    </div>
  </div>
);

export default MentalWellBeing;
