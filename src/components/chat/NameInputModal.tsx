
import { useState } from 'react';
import { Bot } from 'lucide-react';

interface NameInputModalProps {
  onNameSubmit: (name: string) => void;
}

const NameInputModal = ({ onNameSubmit }: NameInputModalProps) => {
  const [tempName, setTempName] = useState('');

  const handleSubmit = () => {
    if (tempName.trim()) {
      onNameSubmit(tempName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-green-100 shadow-xl">
        <div className="text-center mb-6">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <Bot className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Health Mate! 🌟</h2>
          <p className="text-gray-600">I'm your AI health companion. What should I call you?</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your name..."
            className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 border-none"
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={!tempName.trim()}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Chatting 💬
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameInputModal;
