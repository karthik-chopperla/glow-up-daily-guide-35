
import { Heart, Sparkles, Target } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-pink-400 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello there! 👋</h1>
          <p className="text-gray-600">Welcome to your wellness journey</p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-100">
            <div className="bg-pink-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="text-pink-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">7</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-100">
            <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="text-blue-500" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">85%</div>
            <div className="text-sm text-gray-600">Goals Met</div>
          </div>
        </div>

        {/* Daily Motivation */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-6 text-white mb-8">
          <h3 className="text-lg font-semibold mb-2">Today's Motivation ✨</h3>
          <p className="text-purple-100">
            "Small steps every day lead to big changes every year. You're doing amazing!"
          </p>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <button className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-green-100 hover:bg-green-50 transition-colors">
            <span className="text-gray-700 font-medium">Log Today's Mood</span>
            <div className="bg-green-100 p-2 rounded-full">
              <span className="text-green-600">😊</span>
            </div>
          </button>
          <button className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-blue-100 hover:bg-blue-50 transition-colors">
            <span className="text-gray-700 font-medium">Track Water Intake</span>
            <div className="bg-blue-100 p-2 rounded-full">
              <span className="text-blue-600">💧</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
