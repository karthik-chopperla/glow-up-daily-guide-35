
interface ListeningIndicatorProps {
  isListening: boolean;
}

const ListeningIndicator = ({ isListening }: ListeningIndicatorProps) => {
  if (!isListening) return null;

  return (
    <div className="px-4 py-2 bg-blue-100/80 border-t border-blue-200">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-blue-700 font-medium">Listening... Speak now!</span>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default ListeningIndicator;
