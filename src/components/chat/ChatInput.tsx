
import { forwardRef, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  isListening: boolean;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onStartListening: () => void;
  hasSpeechRecognition: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  (
    {
      message,
      isLoading,
      isListening,
      onMessageChange,
      onSend,
      onStartListening,
      hasSpeechRecognition,
    },
    ref
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
        e.preventDefault();
        onSend();
      }
    };

    // --- Auto-resize textarea
    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
    }, [message]);

    // --- Forward inputRef to textarea, so parent can call .focus()
    useEffect(() => {
      if (ref && typeof ref === 'object' && ref.current) {
        (ref.current as any).focus = () => textareaRef.current?.focus();
      }
    }, [ref]);

    return (
      <div className="bg-white/80 backdrop-blur-md p-4 border-t border-green-100">
        <div className="flex items-end space-x-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about nutrition, stress, exercise..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 border-none disabled:opacity-50 resize-none min-h-[48px] max-h-[120px] transition-all"
            autoFocus
          />
          {/* Voice input button */}
          {hasSpeechRecognition && (
            <button
              onClick={onStartListening}
              disabled={isLoading || isListening}
              className={`p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                isListening
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              }`}
              title="Voice input"
            >
              <Mic size={16} />
            </button>
          )}
          {/* Send button */}
          <button
            onClick={onSend}
            disabled={isLoading || !message.trim()}
            className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        {/* Typing animation */}
        {isLoading && (
          <div className="flex items-center mt-2 ml-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce mr-1"></span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '0.15s' }}></span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
            <span className="ml-2 text-xs text-gray-500">Health Mate is thinking…</span>
          </div>
        )}
      </div>
    );
  }
);

ChatInput.displayName = 'ChatInput';

export default ChatInput;
