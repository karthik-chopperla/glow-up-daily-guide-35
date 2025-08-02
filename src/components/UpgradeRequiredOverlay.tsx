
import React from "react";
import { useNavigate } from "react-router-dom";

const planMap: any = {
  gold: "Gold Plan",
  platinum: "Platinum Plan"
};

const UpgradeRequiredOverlay = ({ required = "gold", feature = "" }: { required?: "gold" | "platinum", feature?: string }) => {
  const nav = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 max-w-xs shadow-lg text-center">
        <div className="text-3xl mb-2">⚠️</div>
        <h2 className="font-bold text-lg mb-1">{feature ? `${feature} Locked` : "Upgrade Required"}</h2>
        <div className="mb-3 text-sm text-gray-700">
          {planMap[required] || "Plan"} required to access this feature.
        </div>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold px-4 py-2 rounded-lg mb-2 w-full"
          onClick={() => nav("/subscription-plans")}
        >Upgrade Now</button>
        <button className="w-full underline text-gray-500 mt-1" onClick={() => nav(-1)}>Back</button>
      </div>
    </div>
  );
};

export default UpgradeRequiredOverlay;
