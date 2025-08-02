import { Target, Bell, User, Shield, Moon } from 'lucide-react';
import { useState } from 'react';

const SettingsScreen = () => {
  const [waterGoal, setWaterGoal] = useState(8);
  const [stepsGoal, setStepsGoal] = useState(10000);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [waterReminders, setWaterReminders] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Customize your wellness journey</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-indigo-100">
          <div className="flex items-center mb-4">
            <div className="bg-indigo-100 p-2 rounded-full mr-3">
              <User className="text-indigo-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-400 to-purple-500 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <h4 className="font-semibold text-gray-800">Alex Johnson</h4>
            <p className="text-sm text-gray-600">alex.johnson@email.com</p>
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-green-100">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Target className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Daily Goals</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Water Goal (glasses)</label>
              <input
                type="number"
                value={waterGoal}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Steps Goal</label>
              <input
                type="number"
                value={stepsGoal}
                onChange={(e) => setStepsGoal(Number(e.target.value))}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Goal (hours)</label>
              <input
                type="number"
                value={sleepGoal}
                onChange={(e) => setSleepGoal(Number(e.target.value))}
                step="0.5"
                className="w-full bg-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
              />
            </div>
          </div>
        </div>

        {/* Reminders Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-yellow-100">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <Bell className="text-yellow-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Reminders</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Water Reminders</span>
              <button
                onClick={() => setWaterReminders(!waterReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  waterReminders ? 'bg-blue-400' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    waterReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Medication Reminders</span>
              <button
                onClick={() => setMedicationReminders(!medicationReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  medicationReminders ? 'bg-purple-400' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    medicationReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Other Settings */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-20 border border-gray-100">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Moon className="text-gray-600 mr-3" size={20} />
                <span className="text-gray-700">Dark Mode</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Shield className="text-gray-600 mr-3" size={20} />
                <span className="text-gray-700">Privacy Settings</span>
              </div>
              <span className="text-gray-400">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
