import React, { createContext, useState, useEffect, useContext } from "react";

// Types
export interface HealthData {
  stepsToday: number;
  waterToday: number;
  sleepHours: number;
  caloriesBurned: number;
}
export interface Reminder {
  id: string;
  name: string;
  dose: string;
  frequency: string; // Add frequency as required field
  times: string[];
  autoRefill: boolean;
  taken: Record<string, boolean>;
}
export interface Appointment {
  id: string;
  doctor: string;
  time: string;
  type: "online" | "in-person";
  specialty: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface AppContextType {
  healthData: HealthData;
  setHealthData: React.Dispatch<React.SetStateAction<HealthData>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  // More states can be added as needed
}

const defaultHealth: HealthData = {
  stepsToday: 0,
  waterToday: 0,
  sleepHours: 0,
  caloriesBurned: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData>(defaultHealth);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const h = localStorage.getItem("hm_health");
    const r = localStorage.getItem("hm_reminders");
    const a = localStorage.getItem("hm_appointments");
    if (h) setHealthData(JSON.parse(h));
    if (r) setReminders(JSON.parse(r));
    if (a) setAppointments(JSON.parse(a));
  }, []);
  useEffect(() => {
    localStorage.setItem("hm_health", JSON.stringify(healthData));
  }, [healthData]);
  useEffect(() => {
    localStorage.setItem("hm_reminders", JSON.stringify(reminders));
  }, [reminders]);
  useEffect(() => {
    localStorage.setItem("hm_appointments", JSON.stringify(appointments));
  }, [appointments]);

  return (
    <AppContext.Provider value={{
      healthData, setHealthData,
      reminders, setReminders,
      appointments, setAppointments
    }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (ctx === undefined) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
