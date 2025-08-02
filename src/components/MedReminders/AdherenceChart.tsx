
import React from "react";
import { useApp } from "@/contexts/AppProvider";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const MOCK_HISTORY = [
  { date: "Mon", taken: 2, total: 3 },
  { date: "Tue", taken: 3, total: 3 },
  { date: "Wed", taken: 1, total: 3 },
  { date: "Thu", taken: 3, total: 3 },
  { date: "Fri", taken: 2, total: 3 },
  { date: "Sat", taken: 3, total: 3 },
  { date: "Sun", taken: 2, total: 3 },
];

const AdherenceChart: React.FC = () => {
  const { reminders } = useApp();

  // Optionally, generate stats from reminders, but this is just a mock.
  if (!reminders.length) return null;

  return (
    <div className="bg-white rounded-xl p-3 shadow mt-4">
      <div className="font-bold text-sm mb-2 text-blue-600">Adherence History (mock)</div>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={MOCK_HISTORY}>
          <XAxis dataKey="date" fontSize={11} />
          <YAxis hide domain={[0, 3]} />
          <Tooltip />
          <Bar dataKey="taken" fill="#f472b6" />
          <Bar dataKey="total" fill="#e0e7ef" barSize={0} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-xs text-gray-400 mt-2 text-center">
        <span>Adherence: {Math.round(
          (MOCK_HISTORY.reduce((sum, d) => sum + d.taken, 0) /
            MOCK_HISTORY.reduce((sum, d) => sum + d.total, 0)) *
            100
        )}% (last 7 days)</span>
      </div>
    </div>
  );
};

export default AdherenceChart;
