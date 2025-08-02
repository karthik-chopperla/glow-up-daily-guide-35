
import React from "react";
import BackButton from "../components/BackButton";
import UpgradeRequiredOverlay from "@/components/UpgradeRequiredOverlay";
import { getSubscriptionLevel } from "@/utils/subscriptionUtils";

const HomeRemedies = () => {
  const subscription = getSubscriptionLevel();
  const hasAccess = subscription === "gold" || subscription === "platinum";

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="w-full max-w-md">
        <BackButton label="All Services" />
        <h1 className="text-2xl font-bold mb-4 text-orange-600">Home Remedies</h1>
        <p className="text-gray-600 mb-8">Chat with elders and discover trusted home remedies.</p>
        {!hasAccess && (
          <UpgradeRequiredOverlay required="gold" feature="Home Remedies" />
        )}
        {hasAccess && (
          <div className="bg-white rounded-xl shadow-md p-6 min-h-[200px] flex items-center justify-center text-gray-400">
            [Home remedies UI will go here]
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeRemedies;
