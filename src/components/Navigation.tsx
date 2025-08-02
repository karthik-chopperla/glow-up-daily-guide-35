
import { Home, BarChart3, MessageCircle, Calendar, Settings } from 'lucide-react';

interface NavigationProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

const Navigation = ({ currentScreen, onScreenChange }: NavigationProps) => {
  const navItems = [
    { id: 'welcome', icon: Home, label: 'Welcome' },
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'chatbot', icon: MessageCircle, label: 'Chat' },
    { id: 'daily-log', icon: Calendar, label: 'Daily Log' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-gray-500 hover:text-purple-500 hover:bg-purple-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
