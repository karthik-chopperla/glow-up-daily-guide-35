
import { forwardRef } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  userName?: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, isLoading }, ref) => {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} animate-fade-in`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.isBot 
                ? 'bg-white/70 backdrop-blur-sm border border-green-100' 
                : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white'
            }`}>
              <div className="flex items-start space-x-2">
                {msg.isBot && (
                  <div className="bg-green-100 p-1 rounded-full flex-shrink-0">
                    <Bot className="text-green-600" size={12} />
                  </div>
                )}
                <div className="flex-1">
                  <p className={`text-sm ${msg.isBot ? 'text-gray-700' : 'text-white'} whitespace-pre-line`}>
                    {msg.text}
                  </p>
                  <p className={`text-xs mt-1 ${msg.isBot ? 'text-gray-500' : 'text-blue-100'} flex items-center`}>
                    {!msg.isBot && msg.userName && (
                      <span className="mr-2">{msg.userName}</span>
                    )}
                    {msg.time}
                  </p>
                </div>
                {!msg.isBot && (
                  <div className="bg-white/20 p-1 rounded-full flex-shrink-0">
                    <User className="text-white" size={12} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white/70 backdrop-blur-sm border border-green-100 rounded-2xl p-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <Bot className="text-green-600" size={12} />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">Health Mate is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={ref} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';

export default MessageList;
