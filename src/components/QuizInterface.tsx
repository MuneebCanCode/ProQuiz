import { useEffect, useState } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { Quiz, Question, QuizResult } from '../types/quiz';
import { quizService, calculateScore } from '../services/quizService';
import { QuizQuestion } from './QuizQuestion';

interface QuizInterfaceProps {
  quizId: string;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
}

export function QuizInterface({ quizId, onComplete, onExit }: QuizInterfaceProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<string, string>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, timeRemaining]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const [quizData, questionsData] = await Promise.all([
        quizService.getQuizById(quizId),
        quizService.getQuestionsByQuiz(quizId),
      ]);

      if (quizData && questionsData) {
        setQuiz(quizData);
        setQuestions(questionsData);
        setTimeRemaining(quizData.duration_minutes * 60);
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = new Map(userAnswers);
    newAnswers.set(currentQuestion.id, answer);
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const { score, correctAnswers, details } = calculateScore(questions, userAnswers);

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken,
      passed: score >= quiz.passing_score,
      details: questions.map((q) => ({
        question: q.question_text,
        selectedAnswer: userAnswers.get(q.id) || 'No answer',
        correctAnswer: q.correct_answer,
        isCorrect: userAnswers.get(q.id) === q.correct_answer,
      })),
    };

    try {
      await quizService.saveQuizAttempt({
        user_id: null,
        quiz_id: quizId,
        score,
        total_questions: questions.length,
        correct_answers: correctAnswers,
        time_taken_seconds: timeTaken,
        answers: details,
      });
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    onComplete(result);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = userAnswers.size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Error loading quiz</p>
          <button
            onClick={onExit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {answeredCount} / {questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={userAnswers.get(currentQuestion.id)}
          onAnswerSelect={handleAnswerSelect}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={onExit}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
          >
            Exit Quiz
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={userAnswers.size !== questions.length}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Quiz
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Question Overview</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((q, index) => {
              const isAnswered = userAnswers.has(q.id);
              const isCurrent = index === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isAnswered
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
