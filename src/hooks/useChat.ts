
import { useState, useEffect, useRef } from 'react';
import { aiHealthService } from '../services/aiHealthService';

/**
 * Message interface
 */
interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  userName?: string;
}

interface HealthData {
  stepsToday: number;
  waterToday: number;
  sleepHours: number;
  caloriesBurned: number;
}

export const useChat = (userName: string) => {
  // --- HEALTH STATE
  const [healthData, setHealthData] = useState<HealthData>({
    stepsToday: 0,
    waterToday: 0,
    sleepHours: 0,
    caloriesBurned: 0
  });

  // --- CHAT STATE
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- REFS
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // --- LOAD LOCAL STORAGE ON INIT ---
  useEffect(() => {
    if (userName) {
      const savedMessages = localStorage.getItem('health_mate_chat_history');
      const savedHealthData = localStorage.getItem('health_mate_health_data');

      if (savedHealthData) {
        setHealthData(JSON.parse(savedHealthData));
      }
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // ---- Welcome message on first enter
        const greeting = {
          id: 1,
          text:
            "Hi! I’m your Health Mate 🤖 Ask me anything about health, sleep, or stress.",
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([greeting]);
        localStorage.setItem('health_mate_chat_history', JSON.stringify([greeting]));
      }
    }
  }, [userName]);

  // --- AUTO-SCROLL ON MESSAGES ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- AUTO-FOCUS INPUT WHEN NOT LOADING ---
  useEffect(() => {
    if (!isLoading && inputRef.current) inputRef.current.focus();
  }, [isLoading]);

  // --- SAVE TO LOCAL STORAGE ON CHANGES ---
  useEffect(() => {
    if (userName && messages.length > 0) {
      localStorage.setItem('health_mate_chat_history', JSON.stringify(messages));
    }
  }, [messages, userName]);

  useEffect(() => {
    localStorage.setItem('health_mate_health_data', JSON.stringify(healthData));
  }, [healthData]);

  // --- MOOD DETECTION ---
  const detectMood = (text: string) => {
    const sadWords = [
      'sad', 'depressed', 'anxious', 'worried', 'stressed', 'upset', 'down', 'feel bad'
    ];
    const lowerText = text.toLowerCase();
    return sadWords.some(word => lowerText.includes(word));
  };

  // --- STEP, WATER, SLEEP, CALORIE ANALYSIS ---
  const analyzeSteps = (steps: number) => {
    if (steps < 3000) return "Try to walk more 🐢";
    if (steps <= 7000) return "Doing okay 🚶‍♂️";
    return "Great job! 🎉";
  };

  const analyzeWater = (glasses: number) => {
    if (glasses < 4) return "Try to drink more water! 💧";
    if (glasses <= 8) return "Good hydration! 💧";
    return "Excellent hydration! 💧";
  };

  const analyzeSleep = (hours: number) => {
    if (hours < 6) return "You need more rest! 😴 Try to get 7-9 hours for optimal health.";
    if (hours <= 9) return "Good sleep! 😴 Quality rest is essential for your wellbeing.";
    return "That's quite a bit! 😴 Make sure it's quality sleep.";
  };

  const estimateCalories = (activities: string) => {
    const txt = activities.toLowerCase();
    let cal = 0;
    if (txt.includes('walk')) cal += 250;
    if (txt.includes('run')) cal += 500;
    if (txt.includes('cycle')) cal += 400;
    return cal;
  };

  // --- HEALTH MESSAGE PARSING ---
  const handleHealthTracking = (text: string): string | null => {
    // Steps
    const stepsMatch = text.match(/(\d+)\s*steps?/) || text.match(/walked?\s*(\d+)/i);
    if (stepsMatch) {
      const steps = parseInt(stepsMatch[1]);
      setHealthData(prev => ({ ...prev, stepsToday: steps }));
      return `${steps} steps today - ${analyzeSteps(steps)}`;
    }

    // Water
    const waterMatch =
      text.match(/(\d+)\s*(glass|cup|water)s?/) ||
      text.match(/(drank?|drink)\s*(\d+)/i);
    if (waterMatch) {
      const count = parseInt(waterMatch[1] || waterMatch[2]);
      setHealthData(prev => ({ ...prev, waterToday: count }));
      return `${count} glasses today - ${analyzeWater(count)}`;
    }

    // Sleep
    const sleepMatch =
      text.match(/(\d+)\s*(hour|hr).*sleep/i) ||
      text.match(/slept?\s*(\d+)/i);
    if (sleepMatch) {
      const hrs = parseInt(sleepMatch[1]);
      setHealthData(prev => ({ ...prev, sleepHours: hrs }));
      return `${hrs} hours last night - ${analyzeSleep(hrs)}`;
    }

    // Activities (Calories)
    if (
      text.toLowerCase().includes('activit') ||
      text.toLowerCase().includes('exercise') ||
      /walk|run|cycle/.test(text.toLowerCase())
    ) {
      const calories = estimateCalories(text);
      if (calories > 0) {
        setHealthData(prev => ({
          ...prev,
          caloriesBurned: prev.caloriesBurned + calories,
        }));
        return `Great! I estimate you burned around ${calories} calories from those activities! 🔥`;
      }
    }

    return null;
  };

  // --- CHAT SENDING (AI and instant) ---
  const handleSend = async (messageText?: string) => {
    const textToSend = messageText !== undefined ? messageText : message;
    if (!textToSend.trim() || isLoading) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: textToSend,
      isBot: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userName: userName
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage('');
    setTimeout(() => inputRef.current?.focus(), 300); // Infinite chat flow

    setIsLoading(true);

    try {
      // Mood detection (instant)
      if (detectMood(textToSend)) {
        setTimeout(() => {
          const botResponse: Message = {
            id: updatedMessages.length + 1,
            text: "It’s okay to feel this way 💛 Want a breathing exercise?",
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
          setTimeout(() => inputRef.current?.focus(), 300);
        }, 1000);
        return;
      }

      // Health handling (instant)
      const healthResp = handleHealthTracking(textToSend);
      if (healthResp) {
        setTimeout(() => {
          const botResponse: Message = {
            id: updatedMessages.length + 1,
            text: healthResp,
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, botResponse]);
          setIsLoading(false);
          setTimeout(() => inputRef.current?.focus(), 300);
        }, 1000);
        return;
      }

      // Regular AI response
      const response = await aiHealthService.getHealthAdvice(textToSend);

      setTimeout(() => {
        const botResponse: Message = {
          id: updatedMessages.length + 1,
          text: response,
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 300);
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        const errorResponse: Message = {
          id: updatedMessages.length + 1,
          text: "I apologize, but I'm having trouble connecting right now. Please try again later or contact your healthcare provider for urgent concerns. 💙",
          isBot: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, errorResponse]);
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 300);
      }, 1000);
    }
  };

  // --- CLEAR CHAT ---
  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      localStorage.removeItem('health_mate_chat_history');
      setMessages([]);
      // New welcome message
      const greeting: Message = {
        id: 1,
        text: "Hi! I’m your Health Mate 🤖 Ask me anything about health, sleep, or stress.",
        isBot: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([greeting]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  // --- HEALTH SUMMARY ---
  const getHealthSummary = () => {
    const summary = `📊 Your Daily Health Summary:
• Steps: ${healthData.stepsToday}
• Water: ${healthData.waterToday} glasses
• Sleep: ${healthData.sleepHours} hrs
• Calories Burned: ${healthData.caloriesBurned} cal

${healthData.stepsToday > 5000 ? 'Great activity level! 🎉' : 'Try to be more active today! 💪'}`;
    handleSend(summary);
  };

  // --- FAKE HEART RATE ---
  const checkHeartRate = () => {
    const heartRate = Math.floor(Math.random() * (85 - 60 + 1)) + 60;
    const response = `❤️ ${heartRate} bpm – Normal

Your simulated heart rate looks healthy! Remember, this is just for fun - use a real device for actual monitoring. 😊`;
    handleSend(response);
  };

  // --- STEP, WATER, SLEEP QUICK PROMPT
  const askSteps = () => {
    handleSend("How many steps did you walk today?");
    setTimeout(() => inputRef.current?.focus(), 300);
  };
  const askWater = () => {
    handleSend("How many glasses of water did you drink?");
    setTimeout(() => inputRef.current?.focus(), 300);
  };
  const askSleep = () => {
    handleSend("How many hours did you sleep last night?");
    setTimeout(() => inputRef.current?.focus(), 300);
  };
  const askCalories = () => {
    handleSend("What activities did you do today?");
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  return {
    message,
    setMessage,
    messages,
    isLoading,
    messagesEndRef,
    inputRef,
    handleSend,
    clearChat,
    healthData,
    getHealthSummary,
    checkHeartRate,
    askSteps,
    askWater,
    askSleep,
    askCalories,
  };
};
