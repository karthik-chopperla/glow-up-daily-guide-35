
import { Activity, Droplets, Heart, BarChart3, Timer } from 'lucide-react';

interface HealthButtonsProps {
  onHealthSummary: () => void;
  onHeartRateCheck: () => void;
  onStepsTrack: () => void;
  onWaterTrack: () => void;
  onSleepTrack: () => void;
  onCalorieTrack: () => void;
}

const HealthButtons = ({
  onHealthSummary,
  onHeartRateCheck,
  onStepsTrack,
  onWaterTrack,
  onSleepTrack,
  onCalorieTrack,
}: HealthButtonsProps) => {
  return (
    <div className="p-4 bg-white/50 border-b border-green-100">
      <p className="text-sm text-gray-600 mb-3 font-medium">Health Tracking:</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <button
          onClick={onStepsTrack}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-2 rounded-full hover:from-green-200 hover:to-blue-200 transition-all duration-300"
        >
          <Activity size={14} />
          <span>Track Steps</span>
        </button>
        <button
          onClick={onWaterTrack}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-2 rounded-full hover:from-blue-200 hover:to-cyan-200 transition-all duration-300"
        >
          <Droplets size={14} />
          <span>Water Intake</span>
        </button>
        <button
          onClick={onSleepTrack}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-2 rounded-full hover:from-purple-200 hover:to-indigo-200 transition-all duration-300"
        >
          <Timer size={14} />
          <span>Track Sleep</span>
        </button>
        <button
          onClick={onCalorieTrack}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 px-3 py-2 rounded-full hover:from-yellow-200 hover:to-orange-200 transition-all duration-300"
        >
          <BarChart3 size={14} />
          <span>Calories</span>
        </button>
        <button
          onClick={onHealthSummary}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-2 rounded-full hover:from-purple-200 hover:to-indigo-200 transition-all duration-300"
        >
          <BarChart3 size={14} />
          <span>Show My Daily Health Summary</span>
        </button>
        <button
          onClick={onHeartRateCheck}
          className="flex items-center justify-center space-x-2 text-xs bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-2 rounded-full hover:from-red-200 hover:to-pink-200 transition-all duration-300"
        >
          <Heart size={14} />
          <span>Check Heart Rate</span>
        </button>
      </div>
    </div>
  );
};

export default HealthButtons;
