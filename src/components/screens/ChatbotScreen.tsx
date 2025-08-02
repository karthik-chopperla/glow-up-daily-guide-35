import { useState, useEffect } from 'react';
import NameInputModal from '../chat/NameInputModal';
import ChatHeader from '../chat/ChatHeader';
import QuickQuestions from '../chat/QuickQuestions';
import HealthButtons from '../chat/HealthButtons';
import MessageList from '../chat/MessageList';
import ChatInput from '../chat/ChatInput';
import ListeningIndicator from '../chat/ListeningIndicator';
import SmartSuggestions from '../chat/SmartSuggestions';
import { useChat } from '../../hooks/useChat';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

const ChatbotScreen = () => {
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const quickQuestions = [
    "What should I eat today?",
    "How do I reduce anxiety?",
    "Give me a breathing exercise",
    "Tips for better sleep"
  ];

  const {
    message,
    setMessage,
    messages,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSend,
    clearChat,
    getHealthSummary,
    checkHeartRate,
    askSteps,
    askWater,
    askSleep,
    askCalories
  } = useChat(userName);

  const handleSpeechResult = (transcript: string) => {
    setMessage(transcript);
    handleSend(transcript);
  };

  const { isListening, isSupported, startListening } = useSpeechRecognition(handleSpeechResult);

  // Load user data on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('health_mate_user_name');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNameInput(true);
    }
  }, []);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem('health_mate_user_name', name);
    setShowNameInput(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSend(question);
    // Refocus input after quick question click
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  // Name input modal
  if (showNameInput) {
    return <NameInputModal onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col h-screen">
        {/* Header with bot avatar and clear button */}
        <ChatHeader userName={userName} onClearChat={clearChat} />

        {/* Health Tracking Buttons */}
        <HealthButtons
          onHealthSummary={getHealthSummary}
          onHeartRateCheck={checkHeartRate}
          onStepsTrack={askSteps}
          onWaterTrack={askWater}
          onSleepTrack={askSleep}
          onCalorieTrack={askCalories}
        />

        {/* Quick Questions */}
        <QuickQuestions
          questions={quickQuestions}
          onQuestionClick={handleQuickQuestion}
          showQuestions={messages.length <= 1}
        />

        {/* Message list */}
        <MessageList
          messages={messages}
          isLoading={isLoading}
          ref={messagesEndRef}
        />

        {/* Voice listening indicator */}
        <ListeningIndicator isListening={isListening} />

        {/* Smart Suggestions */}
        <SmartSuggestions onSuggestionClick={handleSuggestionClick} />

        {/* Input */}
        <ChatInput
          ref={inputRef}
          message={message}
          isLoading={isLoading}
          isListening={isListening}
          onMessageChange={setMessage}
          onSend={() => handleSend()}
          onStartListening={startListening}
          hasSpeechRecognition={isSupported}
        />
      </div>
    </div>
  );
};

export default ChatbotScreen;
