
import { Smile, Moon, Footprints, Droplet, Plus } from 'lucide-react';
import { useState } from 'react';

const DailyLogScreen = () => {
  const [mood, setMood] = useState('');
  const [water, setWater] = useState(4);
  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');

  const moods = [
    { emoji: '😢', label: 'Sad', value: 'sad' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😄', label: 'Great', value: 'great' },
    { emoji: '🤩', label: 'Amazing', value: 'amazing' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Check-in</h1>
          <p className="text-gray-600">How are you feeling today?</p>
        </div>

        {/* Mood Tracker */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-yellow-100">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <Smile className="text-yellow-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Mood</h3>
          </div>
          <div className="flex justify-between">
            {moods.map((moodOption) => (
              <button
                key={moodOption.value}
                onClick={() => setMood(moodOption.value)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  mood === moodOption.value 
                    ? 'bg-yellow-100 border-2 border-yellow-300' 
                    : 'hover:bg-yellow-50 border-2 border-transparent'
                }`}
              >
                <span className="text-2xl mb-1">{moodOption.emoji}</span>
                <span className="text-xs text-gray-600">{moodOption.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Tracker */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-purple-100">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <Moon className="text-purple-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Sleep Duration</h3>
          </div>
          <input
            type="number"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            placeholder="Hours of sleep"
            step="0.5"
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 border-none"
          />
        </div>

        {/* Steps Tracker */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-orange-100">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-2 rounded-full mr-3">
              <Footprints className="text-orange-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Steps Today</h3>
          </div>
          <input
            type="number"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="Number of steps"
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-300 border-none"
          />
        </div>

        {/* Water Tracker */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-100">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Droplet className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Water Intake</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <button
                  key={glass}
                  onClick={() => setWater(glass)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    glass <= water 
                      ? 'bg-blue-400 text-white' 
                      : 'bg-gray-200 hover:bg-blue-100'
                  }`}
                >
                  💧
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600">{water}/8 glasses</span>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center mb-20">
          <Plus className="mr-2" size={20} />
          Save Today's Log
        </button>
      </div>
    </div>
  );
};

export default DailyLogScreen;
