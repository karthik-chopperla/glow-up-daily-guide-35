
import React from "react";
import BackButton from "../components/BackButton";

const HomeNursing = () => (
  <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
    <div className="w-full max-w-md">
      <BackButton label="All Services" />
      <h1 className="text-2xl font-bold mb-4 text-yellow-700">Home Nursing</h1>
      <p className="text-gray-600 mb-8">Book qualified nursing services at home for all needs.</p>
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
        [Home nursing UI will go here]
      </div>
    </div>
  </div>
);

export default HomeNursing;
