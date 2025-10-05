import { useState } from 'react';
import { CourseSelection } from './components/CourseSelection';
import { QuizInterface } from './components/QuizInterface';
import { QuizResults } from './components/QuizResults';
import { QuizResult } from './types/quiz';

type AppState = 'courses' | 'quiz' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('courses');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setAppState('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setAppState('results');
  };

  const handleRetakeQuiz = () => {
    setAppState('quiz');
  };

  const handleBackToHome = () => {
    setSelectedQuizId(null);
    setQuizResult(null);
    setAppState('courses');
  };

  return (
    <>
      {appState === 'courses' && <CourseSelection onStartQuiz={handleStartQuiz} />}

      {appState === 'quiz' && selectedQuizId && (
        <QuizInterface
          quizId={selectedQuizId}
          onComplete={handleQuizComplete}
          onExit={handleBackToHome}
        />
      )}

      {appState === 'results' && quizResult && (
        <QuizResults
          result={quizResult}
          onRetake={handleRetakeQuiz}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;
