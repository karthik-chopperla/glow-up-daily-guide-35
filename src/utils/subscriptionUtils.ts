
// Utility to get the subscription level stored in localStorage. Returns one of: "silver", "gold", "platinum".
export function getSubscriptionLevel(): "silver" | "gold" | "platinum" {
  // Your storage key from SubscriptionPlans.tsx
  const level = localStorage.getItem("subscription_plan");
  if (level === "gold" || level === "platinum") return level;
  if (level === "silver") return "silver";
  return "silver"; // default to lowest tier if unset
}
