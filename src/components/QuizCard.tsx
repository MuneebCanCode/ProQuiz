import { Clock, Target, PlayCircle } from 'lucide-react';
import { Quiz } from '../types/quiz';

interface QuizCardProps {
  quiz: Quiz;
  bestScore?: number | null;
  onStart: (quizId: string) => void;
}

export function QuizCard({ quiz, bestScore, onStart }: QuizCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{quiz.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span>Pass: {quiz.passing_score}%</span>
        </div>
      </div>

      {bestScore !== null && bestScore !== undefined && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">
            Your Best Score: <span className="text-lg font-bold">{bestScore}%</span>
          </p>
        </div>
      )}

      <button
        onClick={() => onStart(quiz.id)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <PlayCircle className="w-5 h-5" />
        Start Quiz
      </button>
    </div>
  );
}
