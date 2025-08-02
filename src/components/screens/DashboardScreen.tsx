
import { TrendingUp, Heart, Moon, Footprints, Droplet } from 'lucide-react';

const DashboardScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Health Dashboard</h1>
          <p className="text-gray-600">Here's how you're doing today</p>
        </div>

        {/* Main Health Score */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white mb-6 text-center">
          <h3 className="text-lg font-medium mb-2">Overall Wellness Score</h3>
          <div className="text-4xl font-bold mb-2">87%</div>
          <div className="flex items-center justify-center">
            <TrendingUp size={16} className="mr-1" />
            <span className="text-sm">+5% from yesterday</span>
          </div>
        </div>

        {/* Health Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-red-100">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Heart className="text-red-500" size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Heart Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">72 bpm</div>
            <div className="text-xs text-gray-500">Resting</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center mb-3">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Moon className="text-purple-500" size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Sleep</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">7.5h</div>
            <div className="text-xs text-gray-500">Last night</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-orange-100">
            <div className="flex items-center mb-3">
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <Footprints className="text-orange-500" size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Steps</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">8,247</div>
            <div className="text-xs text-gray-500">Today</div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Droplet className="text-blue-500" size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Water</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">6/8</div>
            <div className="text-xs text-gray-500">Glasses</div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week's Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Daily Goals Met</span>
                <span className="text-gray-800 font-medium">5/7 days</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style={{width: '71%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Average Sleep</span>
                <span className="text-gray-800 font-medium">7.2 hours</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
