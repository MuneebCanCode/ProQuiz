import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}: QuizQuestionProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-600">{question.points} point(s)</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{question.question_text}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          return (
            <button
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                </div>
                <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                  {option}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
