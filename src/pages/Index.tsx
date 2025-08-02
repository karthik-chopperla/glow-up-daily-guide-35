
import { useState } from 'react';
import Navigation from '../components/Navigation';
import WelcomeScreen from '../components/screens/WelcomeScreen';
import DashboardScreen from '../components/screens/DashboardScreen';
import ChatbotScreen from '../components/screens/ChatbotScreen';
import DailyLogScreen from '../components/screens/DailyLogScreen';
import SettingsScreen from '../components/screens/SettingsScreen';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'chatbot':
        return <ChatbotScreen />;
      case 'daily-log':
        return <DailyLogScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
    </div>
  );
};

export default Index;
