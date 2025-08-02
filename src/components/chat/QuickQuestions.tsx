
interface QuickQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  showQuestions: boolean;
}

const QuickQuestions = ({ questions, onQuestionClick, showQuestions }: QuickQuestionsProps) => {
  if (!showQuestions) return null;

  return (
    <div className="p-4 bg-white/50 border-b border-green-100">
      <p className="text-sm text-gray-600 mb-3 font-medium">Quick questions to get started:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-2 rounded-full hover:from-blue-200 hover:to-purple-200 transition-all duration-300"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;
