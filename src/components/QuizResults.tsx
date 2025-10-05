import { CheckCircle, XCircle, Clock, Award, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onBackToHome: () => void;
}

export function QuizResults({ result, onRetake, onBackToHome }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Need Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(result.score);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            {result.passed ? (
              <Award className="w-12 h-12 text-blue-600" />
            ) : (
              <TrendingUp className="w-12 h-12 text-orange-600" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {result.passed ? 'Congratulations!' : 'Quiz Complete'}
          </h1>
          <p className="text-xl text-gray-600">
            {result.passed ? 'You passed the quiz!' : 'Keep practicing to improve your score!'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-5xl font-bold text-blue-600 mb-2">{result.score}%</div>
              <div className="text-sm text-gray-600 font-medium">Final Score</div>
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${performance.bg} ${performance.color}`}>
                {performance.label}
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-5xl font-bold text-green-600 mb-2">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <div className="text-sm text-gray-600 font-medium">Correct Answers</div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round((result.correctAnswers / result.totalQuestions) * 100)}% accuracy
              </div>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-2">{formatTime(result.timeTaken)}</div>
              <div className="text-sm text-gray-600 font-medium">Time Taken</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Question Review</h2>
            <div className="space-y-4">
              {result.details.map((detail, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border-2 ${
                    detail.isCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {detail.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-2">
                        Question {index + 1}: {detail.question}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-600 min-w-24">Your Answer:</span>
                          <span className={`text-sm font-semibold ${
                            detail.isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {detail.selectedAnswer}
                          </span>
                        </div>

                        {!detail.isCorrect && (
                          <div className="flex items-start gap-2">
                            <span className="text-sm font-medium text-gray-600 min-w-24">Correct Answer:</span>
                            <span className="text-sm font-semibold text-green-700">
                              {detail.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
          <button
            onClick={onBackToHome}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Courses
          </button>
        </div>
      </div>
    </div>
  );
}
